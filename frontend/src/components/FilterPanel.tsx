interface FilterPanelProps {
  searchTerm: string;
  onSearhChange: (searchTerm: string) => void;
}
export const FilterPanel = ({
  searchTerm,
  onSearhChange,
}: FilterPanelProps) => {
  return (
    <div className="search-table-container">
      <input
        type="text"
        placeholder="search by name"
        value={searchTerm}
        onChange={(e) => onSearhChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
};
