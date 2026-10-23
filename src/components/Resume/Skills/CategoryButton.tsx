/** Label of the filter that shows every category. */
export const ALL_CATEGORY = 'Todas';

interface CategoryButtonProps {
  label: string;
  handleClick: (label: string) => void;
  isActive: boolean;
}

export default function CategoryButton({
  handleClick,
  isActive,
  label,
}: CategoryButtonProps) {
  const isAll = label === ALL_CATEGORY;

  return (
    <button
      className={[
        'skillbutton',
        isAll ? 'skillbutton--all' : '',
        isActive ? 'skillbutton-active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      type="button"
      onClick={() => handleClick(label)}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}
