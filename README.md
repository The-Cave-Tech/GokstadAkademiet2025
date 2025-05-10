TheCaveTech

\*Strapi AdminPanel-The main admin panel for content managing on site.

- Installer PostCSS Language Support vscode extension for å ungå unknown at rule i tailwind: kan enkelt aktiveres og deaktiveres ved visuelt farge bytte

\*Run

cd frontend: npm run dev
cd backend: npm run develop

npm run test - to run test

# Guide: Integrating Universal UI Components

This guide explains how to use and integrate the universal UI components (TabSelector, FilterDropdown, SearchBar, etc.) throughout your application, with specific focus on the Activities pages and Admin dashboard.

## Overview

The universal components provide a consistent UI framework across your application. We've now implemented:

1. **Universal Card Components** - For displaying content like blogs, events, and projects
2. **Universal Admin Tables** - For managing content in the admin dashboard
3. **Universal UI Elements** - For navigation, filtering, and search functionality

This guide focuses on how to use these components together to create cohesive, maintainable pages.

## Using Universal UI Elements

### TabSelector

The TabSelector component provides a way to switch between different views or content types:

```tsx
// Basic usage
<TabSelector
  tabs={[
    { id: "projects", label: "Prosjekter" },
    { id: "events", label: "Arrangementer" }
  ]}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
/>

// With additional options
<TabSelector
  tabs={tabOptions}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  orientation="vertical" // or "horizontal"
  size="medium" // "small", "medium", or "large"
  fullWidth={false} // true for full width tabs
/>
```

### FilterDropdown

The FilterDropdown component provides a standardized way to filter content:

```tsx
// Basic usage
<FilterDropdown
  filter={filter}
  setFilter={setFilter}
  options={[
    { value: "all", label: "All Items" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ]}
/>

// With additional options
<FilterDropdown
  filter={filter}
  setFilter={setFilter}
  options={filterOptions}
  ariaLabel="Filter items by status"
  placeholder="Select a filter"
/>
```

### SearchBar

The SearchBar component provides a consistent search interface:

```tsx
// Basic usage
<SearchBar
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
/>

// With additional options
<SearchBar
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  placeholder="Search..."
  onSearch={handleSearch} // Function to trigger search
  ariaLabel="Search products"
  className="w-full"
/>
```

### LoadingSpinner

The LoadingSpinner component provides a consistent loading indicator:

```tsx
// Basic usage
<LoadingSpinner />

// With additional options
<LoadingSpinner
  size="medium" // "small", "medium", or "large"
  borderWidth={3}
  color="#6366f1"
  backgroundColor="#e5e7eb"
  className="my-8"
/>
```

## Integrating in the ActivitiesLayout

The ActivitiesLayout component now uses these universal UI elements to provide a consistent interface for the activities pages:

```tsx
// In the ActivitiesLayout
<TabSelector
  tabs={TAB_OPTIONS}
  activeTab={activeTab}
  setActiveTab={onTabAction}
/>

<SearchBar
  searchQuery={searchQuery}
  setSearchQuery={onSearchAction}
  placeholder={`Søk i ${activeTab === "projects" ? "prosjekter" : "arrangementer"}`}
/>

<FilterDropdown
  filter={filter}
  setFilter={onFilterAction}
  options={activeTab === "projects" ? PROJECT_FILTERS : EVENT_FILTERS}
/>
```

## Integration with Universal Cards

In the activities pages, we now use the universal card component with adapters to display content:

```tsx
// In the ProjectsPage
<UniversalCard
  key={project.id}
  {...adaptProjectToCardProps(project, handleProjectClick)}
/>

// In the EventsPage
<UniversalCard
  key={event.id}
  {...adaptEventToCardProps(event, handleEventClick)}
/>
```

The adapter pattern allows us to convert our data models to the props expected by the UniversalCard component.

## Integration with Admin Tables

In the admin dashboard, we use the AdminTable component to manage content:

```tsx
// In the admin pages
<AdminTable
  title="Manage Blog Posts"
  items={blogPosts}
  columns={columns}
  actions={actions}
  isLoading={isLoading}
  error={error}
  successMessage={successMessage}
  getItemId={(post) => post.documentId || post.id}
  imageKey="blogImage"
  getImageUrl={(image) => blogService.getMediaUrl(image)}
/>
```

## Creating New Pages with Universal Components

When creating new pages, follow these steps to integrate all universal components:

1. Import the necessary universal components.
2. Define your state variables (activeTab, filter, searchQuery, etc.).
3. Create handlers for user interactions.
4. Use the appropriate layout components.
5. Use UniversalCard or AdminTable to display content.

### Example: Creating a Product Listing Page

```tsx
"use client";

import React, { useState, useEffect } from "react";
import { UniversalCard } from "@/components/ui/UniversalCard";
import { TabSelector } from "@/components/ui/TabSelector";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { SearchBar } from "@/components/ui/SearchBar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { productService } from "@/lib/data/services/productService";
import { adaptProductToCardProps } from "@/lib/adapters/cardAdapters";

export default function ProductsPage() {
  // State variables
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Data fetching
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle product click
  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  // Filter products based on category and search query
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (category !== "all" && product.category !== category) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Filters and View Toggle */}
      <div className="flex flex-wrap gap-4 mb-8">
        <FilterDropdown
          filter={category}
          setFilter={setCategory}
          options={CATEGORY_OPTIONS}
          ariaLabel="Filter by category"
        />

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search products..."
        />

        <TabSelector
          tabs={[
            { id: "grid", label: "Grid View" },
            { id: "list", label: "List View" },
          ]}
          activeTab={view}
          setActiveTab={setView}
          size="small"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner size="large" />
      ) : (
        <div
          className={
            view === "grid" ? "grid grid-cols-4 gap-6" : "flex flex-col gap-4"
          }
        >
          {filteredProducts.map((product) => (
            <UniversalCard
              key={product.id}
              {...adaptProductToCardProps(product, handleProductClick)}
              variant={view === "grid" ? "vertical" : "horizontal"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

## Best Practices

1. **Consistent Prop Names**: Use consistent prop names across components (e.g., `activeTab`, `searchQuery`).
2. **Adapter Pattern**: Use adapter functions to convert your data models to component props.
3. **State Management**: Consider using context API for shared state across related pages.
4. **Responsive Design**: All universal components are responsive by default.
5. **Accessibility**: Use the `ariaLabel` props to improve accessibility.
6. **Error Handling**: Always handle loading and error states consistently.

By following these guidelines, you'll create a consistent and maintainable UI across your application using the universal component system.
