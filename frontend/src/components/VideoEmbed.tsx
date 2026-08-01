import React from 'react';

interface VideoEmbedProps {
  url: string;
}

export function VideoEmbed({ url }: VideoEmbedProps) {
  if (!url) return null;

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(url);

  if (!videoId) {
    // If it's not a valid YouTube URL, maybe it's just a regular link, 
    // but the requirement is to embed YouTube video.
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-gray-500">
        <p>Nepodržan format video linka. Pokušajte sa YouTube linkom.</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline mt-2 inline-block">
          Otvori link
        </a>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-gray-900 aspect-video relative">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}
