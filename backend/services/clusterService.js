const EARTH_RADIUS_KM = 6371;
const CLUSTER_RADIUS_KM = 1.2; // complaints within this radius + same category are considered related
const MIN_CLUSTER_SIZE = 3;

function haversineKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

const CLUSTER_LABELS = {
  Pothole: "Pothole Cluster",
  "Damaged Road": "Road Damage Cluster",
  Streetlight: "Streetlight Failure Cluster",
  Garbage: "Garbage Overflow Cluster",
  "Water Leakage": "Water Leakage Cluster",
  Drainage: "Drainage Blockage Cluster",
  "Illegal Construction": "Illegal Construction Cluster",
  "Public Nuisance": "Public Nuisance Cluster",
  Other: "Recurring Issue Cluster",
};

const CLUSTER_NARRATIVE = {
  Pothole: "Multiple complaints describe deteriorating road surface conditions across the same corridor.",
  "Damaged Road": "Repeated reports point to structural road damage spanning the same stretch.",
  Streetlight: "Multiple complaints appear to describe a recurring lighting outage across the same corridor.",
  Garbage: "Residents are repeatedly flagging uncollected waste in this micro-zone, suggesting a missed collection route.",
  "Water Leakage": "Several nearby reports suggest an underlying pipeline fault rather than isolated leaks.",
  Drainage: "Recurring drainage complaints in this zone indicate a blocked or undersized storm drain.",
  "Illegal Construction": "Multiple citizens have flagged unauthorized construction activity in the same area.",
  "Public Nuisance": "A pattern of nuisance reports suggests an ongoing, unresolved local disturbance.",
  Other: "A recurring pattern of similar complaints has been detected in this area.",
};

/**
 * Greedy spatial clustering: for each category, group complaints that are
 * within CLUSTER_RADIUS_KM of at least one other complaint in the same
 * growing group (single-linkage). Groups smaller than MIN_CLUSTER_SIZE are
 * discarded (treated as isolated incidents, not a recurring pattern).
 */
export function buildClusters(complaints) {
  const byCategory = complaints.reduce((acc, c) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {});

  const clusters = [];

  for (const [category, items] of Object.entries(byCategory)) {
    const visited = new Set();

    for (let i = 0; i < items.length; i++) {
      if (visited.has(items[i]._id.toString())) continue;

      const group = [items[i]];
      visited.add(items[i]._id.toString());

      // single-linkage expansion
      let expanded = true;
      while (expanded) {
        expanded = false;
        for (const candidate of items) {
          const cid = candidate._id.toString();
          if (visited.has(cid)) continue;
          const isNear = group.some(
            (member) =>
              haversineKm(member.location, candidate.location) <= CLUSTER_RADIUS_KM
          );
          if (isNear) {
            group.push(candidate);
            visited.add(cid);
            expanded = true;
          }
        }
      }

      if (group.length >= MIN_CLUSTER_SIZE) {
        clusters.push({ category, members: group });
      }
    }
  }

  return clusters
    .sort((a, b) => b.members.length - a.members.length)
    .map((cluster, idx) => {
      const avgPriority = Math.round(
        cluster.members.reduce((sum, m) => sum + (m.ai?.priorityScore || 0), 0) /
          cluster.members.length
      );
      const criticalCount = cluster.members.filter(
        (m) => m.ai?.severity === "Critical" || m.ai?.severity === "High"
      ).length;
      const clusterPriority =
        avgPriority >= 75 || criticalCount >= cluster.members.length / 2
          ? "High"
          : avgPriority >= 50
          ? "Medium"
          : "Low";

      const uniqueLocations = new Set(
        cluster.members.map((m) => `${m.location.lat.toFixed(3)},${m.location.lng.toFixed(3)}`)
      ).size;

      const centroid = {
        lat: cluster.members.reduce((s, m) => s + m.location.lat, 0) / cluster.members.length,
        lng: cluster.members.reduce((s, m) => s + m.location.lng, 0) / cluster.members.length,
      };

      const department = cluster.members[0]?.ai?.department || "General Administration";

      return {
        clusterId: `CLST-${cluster.category.slice(0, 3).toUpperCase()}-${idx + 1}`,
        title: `${CLUSTER_LABELS[cluster.category] ?? "Recurring Issue Cluster"} ${idx + 1}`,
        category: cluster.category,
        narrative: CLUSTER_NARRATIVE[cluster.category] ?? CLUSTER_NARRATIVE.Other,
        reportCount: cluster.members.length,
        locationCount: uniqueLocations,
        priority: clusterPriority,
        avgPriorityScore: avgPriority,
        department,
        recommendedAction: `Dispatch a consolidated ${department} work order covering all ${cluster.members.length} linked reports instead of handling them individually.`,
        centroid,
        complaints: cluster.members.map((m) => ({
          complaintId: m.complaintId,
          title: m.title,
          status: m.status,
          severity: m.ai?.severity,
          priorityScore: m.ai?.priorityScore,
          location: m.location,
          createdAt: m.createdAt,
        })),
      };
    });
}

export function findSimilarComplaints(target, allComplaints, limit = 5) {
  return allComplaints
    .filter((c) => c._id.toString() !== target._id.toString() && c.category === target.category)
    .map((c) => ({ complaint: c, distanceKm: haversineKm(target.location, c.location) }))
    .filter((entry) => entry.distanceKm <= CLUSTER_RADIUS_KM * 2.5)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit)
    .map(({ complaint, distanceKm }) => ({
      complaintId: complaint.complaintId,
      title: complaint.title,
      status: complaint.status,
      severity: complaint.ai?.severity,
      distanceKm: Math.round(distanceKm * 100) / 100,
    }));
}
