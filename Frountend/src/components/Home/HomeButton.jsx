/*
 * HomeButton
 * -------------------------------------------------------
 * Reusable button component for the Home page.
 *
 * Keeping buttons in a separate component makes it easier
 * to maintain consistent styling across promotional banners,
 * product sections, and other marketplace sections.
 */

function HomeButton({
  children,
  variant = "primary",
  onClick,
}) {
  /*
   * Different button variants allow the same component
   * to be reused in different sections of the website.
   */
  const variants = {
    primary: `
      bg-[var(--color-blue)]
      text-white
      hover:bg-[var(--color-navy)]
    `,

    secondary: `
      border border-[var(--color-border)]
      bg-white
      text-[var(--color-navy)]
      hover:border-[var(--color-blue)]
      hover:text-[var(--color-blue)]
    `,

    orange: `
      bg-[var(--color-orange)]
      text-[var(--color-navy)]
      hover:brightness-95
    `,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        px-5
        py-3
        text-sm
        font-semibold
        transition-all
        duration-200
        hover:-translate-y-0.5
        active:translate-y-0
        ${variants[variant]}
      `}
    >
      {children}
    </button>
  );
}

export default HomeButton;