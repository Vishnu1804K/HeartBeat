import React, { useState, useEffect, FC, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import {
    FiBookOpen,
    FiSearch,
    FiBookmark,
    FiExternalLink,
    FiPlay,
    FiFileText,
    FiHeadphones,
    FiX
} from 'react-icons/fi';
import { resourcesAPI } from '../services/api';
import { Resource, Category } from '../types';
import './Pages.css';

const Resources: FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [showSaved, setShowSaved] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchResources();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedType, selectedCategory, searchQuery]);

    const fetchData = async (): Promise<void> => {
        try {
            const [resourcesRes, categoriesRes, savedRes] = await Promise.all([
                resourcesAPI.getAll(),
                resourcesAPI.getCategories(),
                resourcesAPI.getSaved()
            ]);
            setResources(resourcesRes.data.resources || []);
            setCategories(categoriesRes.data.categories || []);
            setSavedIds((savedRes.data.resources || []).map((r: Resource) => r.id || (r as unknown as { _id: string })._id));
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchResources = async (): Promise<void> => {
        try {
            const params: { type?: string; category?: string; search?: string } = {};
            if (selectedType) params.type = selectedType;
            if (selectedCategory) params.category = selectedCategory;
            if (searchQuery) params.search = searchQuery;

            const response = await resourcesAPI.getAll(params);
            setResources(response.data.resources || []);
        } catch (error) {
            console.error('Failed to fetch resources:', error);
        }
    };

    const handleSave = async (id: string): Promise<void> => {
        try {
            if (savedIds.includes(id)) {
                await resourcesAPI.unsave(id);
                setSavedIds(savedIds.filter((sid: string) => sid !== id));
                toast.success('Removed from library');
            } else {
                await resourcesAPI.save(id);
                setSavedIds([...savedIds, id]);
                toast.success('Saved to library');
            }
        } catch {
            toast.error('Failed to update library');
        }
    };

    const getTypeIcon = (type: string): React.ReactElement => {
        switch (type) {
            case 'video': return <FiPlay />;
            case 'podcast': return <FiHeadphones />;
            default: return <FiFileText />;
        }
    };

    const clearFilters = (): void => {
        setSelectedType('');
        setSelectedCategory('');
        setSearchQuery('');
        setShowSaved(false);
    };

    const displayedResources = showSaved
        ? resources.filter((r: Resource) => savedIds.includes(r.id))
        : resources;

    if (loading) {
        return (
            <div className="page-loading">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h1>
                        <FiBookOpen className="page-icon" />
                        Educational Resources
                    </h1>
                    <p>Articles, videos, and podcasts to help you on your health journey</p>
                </div>
            </header>

            {/* Search and Filters */}
            <div className="resources-filters">
                <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <select
                        value={selectedType}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="article">📄 Articles</option>
                        <option value="video">🎬 Videos</option>
                        <option value="podcast">🎧 Podcasts</option>
                    </select>

                    <select
                        value={selectedCategory}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat: Category) => (
                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                        ))}
                    </select>

                    <button
                        className={`filter-btn ${showSaved ? 'active' : ''}`}
                        onClick={() => setShowSaved(!showSaved)}
                    >
                        <FiBookmark />
                        Saved ({savedIds.length})
                    </button>

                    {(selectedType || selectedCategory || searchQuery || showSaved) && (
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            <FiX />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Categories Quick Access */}
            <div className="categories-strip">
                {categories.map((cat: Category) => (
                    <button
                        key={cat.id}
                        className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Resources Grid */}
            {displayedResources.length === 0 ? (
                <div className="empty-card">
                    <div className="empty-icon">📚</div>
                    <h3>{showSaved ? 'No Saved Resources' : 'No Resources Found'}</h3>
                    <p>
                        {showSaved
                            ? 'Save resources to build your personal health library'
                            : 'Try adjusting your search or filters'
                        }
                    </p>
                    {(selectedType || selectedCategory || searchQuery) && (
                        <button className="btn-secondary" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="resources-grid">
                    {displayedResources.map((resource: Resource) => (
                        <div key={resource.id} className="resource-card">
                            <div className="resource-thumbnail">
                                {resource.thumbnail ? (
                                    <img src={resource.thumbnail} alt={resource.title} />
                                ) : (
                                    <div className="thumbnail-placeholder">
                                        {getTypeIcon(resource.type)}
                                    </div>
                                )}
                                <span className="resource-type-badge">
                                    {getTypeIcon(resource.type)}
                                    {resource.type}
                                </span>
                                {resource.duration && (
                                    <span className="resource-duration">{resource.duration}</span>
                                )}
                            </div>

                            <div className="resource-content">
                                <div className="resource-category">{resource.category.replace('-', ' ')}</div>
                                <h3>{resource.title}</h3>
                                <p>{resource.description}</p>

                                {resource.author && (
                                    <div className="resource-author">By {resource.author}</div>
                                )}

                                <div className="resource-tags">
                                    {resource.tags.slice(0, 3).map((tag: string, idx: number) => (
                                        <span key={idx} className="tag">#{tag}</span>
                                    ))}
                                </div>

                                <div className="resource-actions">
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary small"
                                    >
                                        <FiExternalLink />
                                        {resource.type === 'video' ? 'Watch' : resource.type === 'podcast' ? 'Listen' : 'Read'}
                                    </a>
                                    <button
                                        className={`btn-bookmark ${savedIds.includes(resource.id) ? 'saved' : ''}`}
                                        onClick={() => handleSave(resource.id)}
                                    >
                                        <FiBookmark />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Resources;
