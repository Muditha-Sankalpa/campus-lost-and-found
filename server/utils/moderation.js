exports.buildModeratorDashboardSummary = (payload = {}) => ({
  pendingItems: payload.pendingItems || [],
  pendingClaims: payload.pendingClaims || [],
  rejectedReports: payload.rejectedReports || [],
  stats: payload.stats || {
    totalItems: 0,
    pendingItems: 0,
    approvedItems: 0,
    recoveredItems: 0,
    rejectedItems: 0
  }
});
