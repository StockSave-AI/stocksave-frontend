function WelcomeCard({ greeting, name = "User" }) {
  const title = greeting || `Welcome Back, ${name}!`;

  return (
    <div className="bg-primary-500 text-white rounded-card p-6 shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
      <h2 className="text-h2">{title}</h2>
      <p className="text-primary-100">
        Track your savings progress and manage your account
      </p>
    </div>
  );
}

export default WelcomeCard;
