import ErrorLogo from '@/components/ui/ErrorLogo';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <ErrorLogo />
      <p className="text-2xl md:text-4xl lg:text-6xl font-light text-center">
        Oh.. Oh oh oh oh oooh 🎶
      </p>
    </div>
  );
};

export default NotFound;