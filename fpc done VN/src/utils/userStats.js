// src/utils/userStats.js

export const getUserRank = (username) => {
  if (!username) return { rank: 'Khách Lạ 👽', discount: 0, totalSpent: 0, orderCount: 0 };

  let orders = [];
  try {
    const parsed = JSON.parse(localStorage.getItem('mood_fpv_orders'));
    orders = Array.isArray(parsed) ? parsed : [];
  } catch {
    orders = [];
  }

  // Lọc chỉ những đơn hàng của user này
  const userOrders = orders.filter(o => o.username === username);
  
  // Tính tổng
  const totalSpent = userOrders.reduce((sum, o) => sum + (o.originalTotal || o.total), 0);
  const orderCount = userOrders.length;

  // Xếp hạng (Rank)
  if (totalSpent >= 100000000) return { rank: 'Kim Cương 💎', discount: 0.10, totalSpent, orderCount };
  if (totalSpent >= 50000000) return { rank: 'Bạch Kim ⚡', discount: 0.07, totalSpent, orderCount };
  if (totalSpent >= 20000000) return { rank: 'Vàng 🎖️', discount: 0.05, totalSpent, orderCount };
  if (totalSpent >= 5000000) return { rank: 'Bạc 🥈', discount: 0.03, totalSpent, orderCount };
  
  return { rank: 'Thành Viên 🧑‍✈️', discount: 0, totalSpent, orderCount };
};
