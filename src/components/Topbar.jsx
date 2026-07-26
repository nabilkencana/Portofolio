const Topbar = ({ activePage, setIsSidebarOpen }) => {
  return (
    <header
      className="h-16 px-6 flex items-center justify-between"
      style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(255, 255, 255, 0.015)",
      }}
    >
      <button className="lg:hidden block" onClick={() => setIsSidebarOpen(true)} aria-label="Open Sidebar Menu">
        <i className="ri-menu-4-line text-2xl"></i>
      </button>
      <h1 className="capitalize font-semibold">{activePage}</h1>
    </header>
  );
};

export default Topbar;
