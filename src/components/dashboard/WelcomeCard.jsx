function WelcomeCard({ name = "User" }) {
  return (
    <div className="bg-primary-500 text-white rounded-card p-6 shadow-card">
      <h2 className="text-h2">Welcome Back, {name} 👋</h2>
      <p className="text-primary-100 mt-2">
        Track your savings progress and manage your account
      </p>
    </div>
  );
}

export default WelcomeCard;
