"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, FolderOpen, X, Check } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async () => {
    if (!newCategory.name.trim()) return;
    setSaving(true);
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    });
    setNewCategory({ name: "", description: "" });
    setShowForm(false);
    setSaving(false);
    fetchCategories();
  };

  const handleUpdate = async (id: string) => {
    setSaving(true);
    await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...editData }),
    });
    setEditingId(null);
    setSaving(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditData({ name: cat.name, description: cat.description || "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-stone-200 p-6 mb-6">
          <h2 className="text-base font-semibold text-stone-900 mb-4">New Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
              <input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Category name"
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <input
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Brief description"
                className="w-full px-4 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="px-6 py-2 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Category"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-stone-300 text-stone-700 rounded-md text-sm font-medium hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-5 gap-4 px-5 py-3 bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wider">
          <div className="col-span-2">Category</div>
          <div>Products</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-stone-100">
          {categories.map((cat) => (
            <div key={cat.id} className="px-5 py-4 md:grid md:grid-cols-5 md:gap-4 md:items-center space-y-2 md:space-y-0">
              <div className="col-span-2 flex items-center gap-3">
                <div className="p-2 bg-stone-100 rounded-md">
                  <FolderOpen className="h-4 w-4 text-stone-600" />
                </div>
                {editingId === cat.id ? (
                  <div className="flex-1 space-y-1">
                    <input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-stone-300 text-sm"
                    />
                    <input
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-stone-300 text-xs"
                      placeholder="Description"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-stone-900">{cat.name}</p>
                    <p className="text-xs text-stone-500">{cat.description || "No description"}</p>
                  </div>
                )}
              </div>
              <div className="text-sm text-stone-600">{cat._count?.products || 0} products</div>
              <div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-end gap-2">
                {editingId === cat.id ? (
                  <>
                    <button onClick={() => handleUpdate(cat.id)} disabled={saving} className="p-1.5 text-emerald-600 hover:text-emerald-800">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 text-stone-400 hover:text-stone-900">
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(cat)} className="p-1.5 text-stone-400 hover:text-stone-900">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-stone-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="p-8 text-center text-sm text-stone-400">No categories yet. Add one above.</div>
          )}
        </div>
      </div>
    </div>
  );
}
