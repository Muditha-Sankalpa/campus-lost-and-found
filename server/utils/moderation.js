exports.buildModeratorDashboardSummary = (payload = {}) => ({
  pendingItems: payload.pendingItems || [],
  pendingClaims: payload.pendingClaims || [],
  rejectedReports: payload.rejectedReports || [],
  approvedItems: payload.approvedItems || [],
  recoveredItems: payload.recoveredItems || [],
  stats: payload.stats || {
    totalItems: 0,
    pendingItems: 0,
    approvedItems: 0,
    recoveredItems: 0,
    rejectedItems: 0
  }
});
