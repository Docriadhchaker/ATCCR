type Props = {
  title: string;
  description?: string;
  id?: string;
};

export function SectionHeading({ title, description, id }: Props) {
  return (
    <header id={id} className="mx-auto max-w-3xl space-y-2 text-center">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm text-muted-foreground md:text-base">{description}</p>
      ) : null}
    </header>
  );
}
