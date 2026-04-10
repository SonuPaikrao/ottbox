import SearchSkeleton from '@/components/Skeletons/SearchSkeleton';
import SearchInput from "@/components/Shared/SearchInput";
import SearchFilterBar from "@/components/Search/SearchFilterBar";

export default function Loading() {
    return (
        <div style={{ minHeight: '100vh', paddingBottom: '50px' }}>
            <div className="container" style={{ paddingTop: '100px' }}>
                {/* Keep Input and Filters Visible while loading results */}
                <div style={{ marginBottom: '30px' }}>
                    <SearchInput initialQuery="" />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '10px', color: '#888' }}>Advanced Filters</h3>
                    <SearchFilterBar />
                </div>

                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '20px', paddingLeft: '15px', borderLeft: '4px solid var(--primary)', lineHeight: 1 }}>
                    Searching...
                </h2>

                <SearchSkeleton />
            </div>
        </div>
    );
}
