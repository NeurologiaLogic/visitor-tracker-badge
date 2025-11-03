# Visitor Tracker Badge

Add a visitor tracking badge to your page—easy plug-and-play!  

## Demo

See it live:  
[https://neurologialogic.github.io/visitor-tracker-badge/](https://neurologialogic.github.io/visitor-tracker-badge/)

## Badge
Copy and paste this Markdown anywhere to show your visitor count:

```bash
![Page Views](https://visitor-tracker-badge.vercel.app?site=https://your-site.com/&label=Page Views)

Or, if using HTML /React / Next.js:

<img
  src={`https://visitor-tracker-badge.vercel.app?site=https://your-site.com/${slug}&label=Blog Views`}
  alt={`Views for ${slug}`}
  className="h-6"
/>
```

## Steps:
1. Replace `https://your-site.com/` with your page URL.  
2. Replace `Page Views` or `Blog Views` with your preferred label.

Example (React / Next.js):
```js
<img
  src={`https://visitor-tracker-badge.vercel.app?site=https://your-site.com/${slug}&label=Blog Views`}
  alt={`Views for ${slug}`}
  className="h-6"
/>
```


## How It Works

1. The badge sends a request to `visitor-tracker-badge.vercel.app` with your site url as the key.  
2. The server counts the number of visits for that URL.  
3. The server returns a dynamic image showing the total visits.  
4. The badge automatically updates whenever your page is viewed.


## Features

- Lightweight and script-free  
- Shows live visitor counts  
- Customizable label and size  
- Works on any static or dynamic website  

## License

MIT License — free to use and modify.
