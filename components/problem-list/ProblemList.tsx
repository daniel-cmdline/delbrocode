'use client';

import { useState } from 'react';
import { Problem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Bookmark, BookmarkCheck } from 'lucide-react';
import Link from 'next/link';

interface ProblemListProps {
  problems: Problem[];
  userProgress?: Record<string, 'Attempted' | 'Solved'>;
  bookmarks?: string[];
}

export function ProblemList({ problems, userProgress = {}, bookmarks = [] }: ProblemListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'all' || problem.category === categoryFilter;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const categories = [...new Set(problems.map(p => p.category))];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Solved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Attempted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
        
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-white hover:bg-gray-700">All Difficulties</SelectItem>
            <SelectItem value="Easy" className="text-white hover:bg-gray-700">Easy</SelectItem>
            <SelectItem value="Medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
            <SelectItem value="Hard" className="text-white hover:bg-gray-700">Hard</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-white hover:bg-gray-700">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Problems Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProblems.map((problem) => (
          <Card key={problem.id} className="hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/50 hover:bg-gray-800 transition-all duration-300 ease-in-out bg-gray-900 border border-gray-800 text-white cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight text-white">
                  <Link 
                    href={`/problems/${problem.id}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {problem.title}
                  </Link>
                </CardTitle>
                <div className="flex items-center gap-2">
                  {bookmarks.includes(problem.id) && (
                    <BookmarkCheck className="w-4 h-4 text-primary" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(problem.difficulty) + ' border-none'}>
                  {problem.difficulty}
                </Badge>
                <Badge variant="outline" className="border-gray-700 text-gray-300 bg-gray-800">
                  {problem.category}
                </Badge>
                {userProgress[problem.id] && (
                  <Badge className={getStatusColor(userProgress[problem.id]) + ' border-none'}>
                    {userProgress[problem.id]}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-300 line-clamp-2">
                {problem.description.slice(0, 100)}...
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{problem.time_limit}ms</span>
                <span>{problem.memory_limit}MB</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No problems found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}