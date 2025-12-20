import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { FaBrain, FaChevronLeft, FaChevronRight, FaXmark } from 'react-icons/fa6';
import { Search, Code2, FileText, Tag } from 'lucide-react';

// UI Components
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null); // State for the popup

  // Search & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15; // Increased page size since rows are smaller

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const metadataRef = doc(db, "system", "metadata");
        const snapshot = await getDoc(metadataRef);

        if (!snapshot.exists()) {
          toast.error("Unable to load problems.");
          return;
        }

        const data = snapshot.data();
        // Handle potentially different data structures
        const rawProblems = data?.problems?.all || data?.problemIds?.all || [];
        setProblems(rawProblems);
      } catch (error) {
        console.error("Error fetching problems:", error);
        toast.error("Failed to fetch problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // --- Filter Logic ---
  const filteredProblems = useMemo(() => {
    if (!searchQuery) return problems;
    const lowerQuery = searchQuery.toLowerCase();
    return problems.filter(p => {
      const title = p.title || p.id || "";
      return title.toLowerCase().includes(lowerQuery);
    });
  }, [problems, searchQuery]);

  // --- Pagination Logic ---
  const totalItems = filteredProblems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const start = (currentPage - 1) * pageSize;
  const pagedProblems = filteredProblems.slice(start, start + pageSize);

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
    document.getElementById("problem-list-top")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return "text-green-600 bg-green-500/10 border-green-500/20";
      case 'medium': return "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
      case 'hard': return "text-red-600 bg-red-500/10 border-red-500/20";
      default: return "text-muted-foreground bg-secondary";
    }
  };

  return (
    <div className="min-h-screen pb-20 relative">
      
      {/* --- 1. Header Section (Simplified & Smaller) --- */}
      <div className='flex flex-col w-full items-center pt-16 space-y-4 px-4'>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge variant="outline" className="mb-3 px-3 py-1 text-xs border-primary/20 bg-secondary/30 text-foreground/80 rounded-full">
            <FaBrain className="text-yellow-500 mr-2" />
            <span>Problem Set</span>
          </Badge>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Explore <span className="text-primary">Challenges</span>
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            Browse our collection of algorithms and data structures.
          </p>
        </motion.div>
      </div>

      {/* --- 2. Main List Area --- */}
      <section id="problem-list-top" className='w-full max-w-4xl mx-auto mt-8 px-4 space-y-4'>
        
        {/* Search Input */}
        <div className='relative w-full'>
          <Search className='absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground' size={16} />
          <Input 
            className="pl-9 h-10 text-sm bg-background/50" 
            placeholder="Search problems..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card className="border shadow-sm overflow-hidden">
          {/* Compact Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-muted/40 border-b text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-8">Title</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-1 text-right">View</div>
          </div>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : pagedProblems.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No problems found.
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {pagedProblems.map((problem, idx) => (
                  <div 
                    key={problem.id} 
                    onClick={() => setSelectedProblem(problem)}
                    className="group flex flex-col md:grid md:grid-cols-12 gap-3 items-center p-3 hover:bg-muted/30 transition-colors cursor-pointer text-sm"
                  >
                    {/* Index / ID */}
                    <div className="hidden md:block col-span-1 text-xs text-muted-foreground font-mono">
                      {start + idx + 1}
                    </div>

                    {/* Title & Tags */}
                    <div className="w-full md:col-span-8">
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {problem.title || problem.id}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {/* Display first 3 tags if available */}
                        {problem.tags && problem.tags.slice(0, 3).map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] bg-secondary px-1.5 rounded text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="w-full md:col-span-2 flex items-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty || "Medium"}
                      </span>
                    </div>

                    {/* Arrow Icon */}
                    <div className="hidden md:flex col-span-1 justify-end text-muted-foreground group-hover:translate-x-1 transition-transform">
                      <FaChevronRight size={12} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {/* Compact Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-end px-4 py-2 border-t bg-muted/10 gap-2">
              <span className="text-xs text-muted-foreground mr-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                <FaChevronLeft className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                <FaChevronRight className="w-3 h-3" />
              </Button>
            </div>
          )}
        </Card>
      </section>

      {/* --- 3. PROBLEM DETAIL POPUP (MODAL) --- */}
      <AnimatePresence>
        {selectedProblem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProblem(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-card border shadow-xl rounded-xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b bg-muted/20">
                <div className='space-y-1'>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-foreground">
                            {selectedProblem.title || "Untitled Problem"}
                        </h2>
                        <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${getDifficultyColor(selectedProblem.difficulty)}`}>
                            {selectedProblem.difficulty || "Medium"}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">ID: {selectedProblem.id}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2" onClick={() => setSelectedProblem(null)}>
                  <FaXmark className="h-4 w-4" />
                </Button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-primary">
                    <FileText size={16} />
                    <span>Problem Statement</span>
                </div>
                
                {/* Statement Text */}
                <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed">
                   {selectedProblem.statement ? (
                     <p className="whitespace-pre-line">{selectedProblem.statement}</p>
                   ) : (
                     <p className="italic opacity-50">No problem statement available for this ID.</p>
                   )}
                </div>

                {/* Tags Section */}
                {selectedProblem.tags && selectedProblem.tags.length > 0 && (
                    <div className="mt-8 pt-4 border-t">
                        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-muted-foreground uppercase">
                            <Tag size={12} />
                            <span>Related Topics</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedProblem.tags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="font-normal text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t bg-muted/10 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedProblem(null)}>Close</Button>
                <Button>Start Coding</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Problems;