const Topbar = ({ activePage, setIsSidebarOpen }) => {
  return (
    <header className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between">
      <button className="lg:hidden block" onClick={() => setIsSidebarOpen(true)}>
        <i className="ri-menu-4-line text-2xl"></i>
      </button>
      <h1 className="capitalize font-semibold">{activePage}</h1>
    </header>
  );
};

export default Topbar;
