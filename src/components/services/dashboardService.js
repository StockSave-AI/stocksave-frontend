export const getDashboardData = async () => {
  // Mock data while API isn't ready
  const mockData = {
    users: 10,
    sales: 50,
    revenue: 1000,
  };

  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: mockData }), 500);
  });
};

// export const getDashboardData = async () => {
//   const response = await fetch("https://your-api-endpoint.com/dashboard");
//   if (!response.ok) throw new Error("Network response was not ok");
//   const data = await response.json();
//   return { data };
// };
