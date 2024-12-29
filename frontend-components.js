// src/components/List/ResearchList.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const ResearchList = () => {
  const [researchItems, setResearchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResearchItems();
  }, []);

  const fetchResearchItems = async () => {
    try {
      const response = await fetch('/api/research/list');
      const data = await response.json();
      setResearchItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching research items:', error);
      setLoading(false);
    }
  };

  const filteredItems = researchItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.authors.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-bold">Research List</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search research..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>Add New</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Authors</th>
              <th>Year</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.authors}</td>
                <td>{item.year}</td>
                <td>{item.type}</td>
                <td>
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardContent>
    </Card>
  );
};

// src/components/Detail/ResearchDetail.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const ResearchDetail = ({ id }) => {
  const [research, setResearch] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchResearchDetail();
    }
  }, [id]);

  const fetchResearchDetail = async () => {
    try {
      const response = await fetch(`/api/research/item/${id}`);
      const data = await response.json();
      setResearch(data);
      setFiles(data.files || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching research detail:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!research) return <div>Research not found</div>;

  return (
    <Card className="w-full">
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="ai">AI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{research.title}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Authors</h3>
                  <p>{research.authors}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Year</h3>
                  <p>{research.year}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Summary</h3>
                <p>{research.summary}</p>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => generatePresentation(research.id)}>
                  Generate Presentation
                </Button>
                <Button variant="outline">Export Data</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files">
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                  <span>{file.name}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
