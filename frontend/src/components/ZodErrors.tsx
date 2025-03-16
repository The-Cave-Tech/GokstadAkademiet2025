export function ZodErrors({ error }: { error: string[] }) {
    if (!error) return null;
    return error.map((err: string, index: number) => (
      <div key={index} className="text-zodValidation text-sm font-roboto font-normal italic mt-1">
        {err}
      </div>
    ));
  }