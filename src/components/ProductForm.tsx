"use client";

import { useRef, useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import {
  toPayload,
  validateProduct,
  type ProductFormErrors,
  type ProductFormValues,
} from "@/lib/validateProduct";
import type { ProductInput } from "@/services/products";
import Field from "./Field";
import GlassSelect from "./GlassSelect";

type Props = {
  initial?: Partial<ProductFormValues>;
  submitLabel: string;
  onSubmit: (input: ProductInput) => Promise<void>;
  onCancel: () => void;
};

const EMPTY: ProductFormValues = { title: "", description: "", category: "", brand: "", price: "", stock: "" };

export default function ProductForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const categories = useCategories();
  const [values, setValues] = useState<ProductFormValues>({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);
  // Blocks a second submit instantly, before the disabled button re-renders.
  const busy = useRef(false);

  const set = (name: keyof ProductFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy.current) return;
    const found = validateProduct(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    busy.current = true;
    setSaving(true);
    setSubmitError("");
    try {
      await onSubmit(toPayload(values));
      // Leave busy set: the page navigates away after a successful save.
    } catch (err) {
      setSubmitError((err as Error).message);
      busy.current = false;
      setSaving(false);
    }
  }

  // Keep the current category selectable even if the category list failed to load.
  const options = categories.some((c) => c.slug === values.category) || !values.category
    ? categories
    : [{ slug: values.category, name: values.category }, ...categories];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 card p-6">
      <Field label="Title" error={errors.title}>
        <input className="input" value={values.title} onChange={set("title")} aria-invalid={!!errors.title} />
      </Field>
      <Field label="Description" error={errors.description}>
        <textarea className="input min-h-24" value={values.description} onChange={set("description")} aria-invalid={!!errors.description} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category" error={errors.category}>
          <GlassSelect
            aria-label="Category"
            aria-invalid={!!errors.category}
            value={values.category}
            options={options.map((c) => ({ value: c.slug, label: c.name }))}
            onChange={(category) => {
              setValues((v) => ({ ...v, category }));
              setErrors((er) => ({ ...er, category: undefined }));
            }}
          />
        </Field>
        <Field label="Brand (optional)">
          <input className="input" value={values.brand} onChange={set("brand")} />
        </Field>
        <Field label="Price (USD)" error={errors.price}>
          <input className="input" inputMode="decimal" value={values.price} onChange={set("price")} aria-invalid={!!errors.price} />
        </Field>
        <Field label="Stock" error={errors.stock}>
          <input className="input" inputMode="numeric" value={values.stock} onChange={set("stock")} aria-invalid={!!errors.stock} />
        </Field>
      </div>

      {submitError && <p role="alert" className="text-sm text-danger">{submitError}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" className="btn" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving…" : submitLabel}</button>
      </div>
    </form>
  );
}
