const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-900 h-full flex items-center justify-center">
        {children}
      </div>
    </>
  );
};

export default AuthLayout;
