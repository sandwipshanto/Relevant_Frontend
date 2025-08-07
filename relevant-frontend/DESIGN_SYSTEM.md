# Design System Documentation

## Color Palette

### Primary Colors
- **Purple**: Primary brand color
  - `bg-purple-50` - Light background
  - `bg-purple-600` - Primary buttons
  - `bg-purple-700` - Button hover
  - `text-purple-900` - Headings
  - `text-purple-800` - Body text

### Semantic Colors
- **Success**: Green tones for positive actions
- **Warning**: Yellow tones for cautions
- **Error**: Red tones for errors
- **Info**: Blue tones for information

## Typography

### Headings
- **Page Title**: `text-3xl font-bold text-gray-900`
- **Section Title**: `text-xl font-semibold text-gray-900`
- **Card Title**: `text-lg font-medium text-gray-900`

### Body Text
- **Primary**: `text-gray-600`
- **Secondary**: `text-gray-500`
- **Muted**: `text-gray-400`

## Component Patterns

### Cards
```tsx
<Card className="hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Buttons
- **Primary**: Purple background, white text
- **Secondary**: White background, gray border
- **Ghost**: Transparent background

### Error Handling
Use the standardized `ErrorDisplay` component:
```tsx
<ErrorDisplay
  title="Error Title"
  message="Error message"
  onRetry={retryFunction}
  variant="error|warning|info"
/>
```

### Loading States
- Use `LoadingSpinner` for async operations
- Show skeleton loading for better UX
- Disable buttons during loading

## Layout Guidelines

### Spacing
- Page padding: `px-4 sm:px-6 lg:px-8 py-8`
- Section margin: `mb-8`
- Card gap: `gap-6`

### Responsive Breakpoints
- Mobile: Default
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

## Best Practices

1. **Consistency**: Use design tokens consistently
2. **Accessibility**: Ensure proper contrast ratios
3. **Performance**: Optimize for loading states
4. **Responsiveness**: Mobile-first approach
5. **Error Handling**: Always provide fallbacks
