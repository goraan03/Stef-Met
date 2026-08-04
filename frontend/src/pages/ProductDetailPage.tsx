import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/endpoints';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { ErrorMessage } from '@/components/UI/ErrorMessage';
import { ArrowLeft, ArrowRight, Factory, ImageOff, Mail, Phone } from 'lucide-react';
import { getImageUrl } from '@/utils/format';
import { VideoEmbed } from '@/components/VideoEmbed';

export function ProductDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [activeIndex, setActiveIndex] = useState(0);
    const [imageError, setImageError] = useState(false);

    const { data: productResponse, isLoading, isError } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => productsApi.getBySlug(slug!),
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="section">
                <div className="container">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (isError || !productResponse) {
        return (
            <div className="section">
                <div className="container">
                    <ErrorMessage message="Oprema nije pronađena" />
                </div>
            </div>
        );
    }

    const product = productResponse.data;
    const images = product.images || [];
    const hasMultiple = images.length > 1;

    const goToPrev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
    const goToNext = () => setActiveIndex((i) => (i + 1) % images.length);
    const currentImageUrl = images.length > 0 ? getImageUrl(images[activeIndex]) : null;

    return (
        <div className="section">
            <div className="container">
                <Link
                    to="/proizvodi"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Nazad na opremu
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="flex flex-col gap-3">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-[#1C1E22] rounded-xl overflow-hidden border border-white/10 group">
                            {currentImageUrl && !imageError ? (
                                <img
                                    key={activeIndex}
                                    src={currentImageUrl}
                                    alt={`${product.name} - slika ${activeIndex + 1}`}
                                    onError={() => setImageError(true)}
                                    className="w-full h-full object-cover transition-opacity duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    {imageError ? <ImageOff className="w-24 h-24 text-gray-300" /> : <Factory className="w-24 h-24 text-gray-300" />}
                                </div>
                            )}

                            {/* Arrows — only when multiple images */}
                            {hasMultiple && (
                                <>
                                    <button
                                        onClick={goToPrev}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                        aria-label="Prethodna slika"
                                    >
                                        <ArrowLeft className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <button
                                        onClick={goToNext}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                        aria-label="Sledeća slika"
                                    >
                                        <ArrowRight className="w-4 h-4 text-gray-700" />
                                    </button>

                                    {/* Counter badge */}
                                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                                        {activeIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnail strip — only when multiple images */}
                        {hasMultiple && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setActiveIndex(idx);
                                            setImageError(false);
                                        }}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                            idx === activeIndex
                                                ? 'border-primary-500 opacity-100 ring-2 ring-primary-500/50'
                                                : 'border-white/10 opacity-60 hover:opacity-90'
                                        }`}
                                        aria-label={`Slika ${idx + 1}`}
                                    >
                                        <img
                                            src={getImageUrl(img)}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <div className="mb-4">
                            <Link
                                to={`/proizvodi?categoryId=${product.category.id}`}
                                className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-200"
                            >
                                {product.category.name}
                            </Link>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-6">
                            {product.name}
                        </h1>

                        {product.description && (
                            <div className="prose prose-lg max-w-none mb-8">
                                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        <div className="bg-[#1C1E22] rounded-xl p-6 border border-white/10">
                            <h3 className="font-semibold text-lg text-white mb-4">
                                Zainteresovani ste za ovu opremu?
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Kontaktirajte nas za više informacija, tehničke specifikacije, dostupnost i cenu.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    to="/kontakt"
                                    className="btn-primary flex-1 justify-center"
                                >
                                    <Mail className="w-4 h-4" />
                                    Pošalji upit
                                </Link>
                                <a
                                    href="tel:+381000000000"
                                    className="btn-secondary flex-1 justify-center"
                                >
                                    <Phone className="w-4 h-4" />
                                    Pozovi nas
                                </a>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-900/50 rounded-lg">
                            <p className="text-sm text-blue-200">
                                <strong>Napomena:</strong> Sve informacije o opremi, tehničkim karakteristikama,
                                dostupnosti i cenama možete dobiti kontaktiranjem naše kompanije.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Video section */}
                {product.videoUrl && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-white mb-6">Video prikaz opreme</h2>
                        <div className="max-w-4xl">
                            <VideoEmbed url={product.videoUrl} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}