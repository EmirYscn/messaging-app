import BackButton from "../ui/BackButton";

function PageNotFound() {
  return (
    <main className="h-screen bg-[var(--color-grey-50)] text-[var(--color-grey-900)] flex items-center justify-center p-12">
      <div className="bg-[var(--color-grey-0)] border border-[var(--color-grey-100)] rounded-md p-12 max-w-[96rem] flex-1 text-center">
        <header className="text-2xl mb-8">
          The page you are looking for could not be found 😢
        </header>
        <BackButton />
      </div>
    </main>
  );
}

export default PageNotFound;
