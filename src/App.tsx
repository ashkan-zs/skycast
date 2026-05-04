import AppLayout from "./components/layout/AppLayout";
import SearchBar from "./components/search/SearchBar";

function App() {
  return (
    <AppLayout>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 pt-8 sm:pt-12 lg:pt-16">
        <h1 className="font-display text-4xl font-bold leading-tight text-neutral-0 sm:text-5xl">
          Weather
        </h1>
        <SearchBar />
      </section>
    </AppLayout>
  );
}

export default App;
