
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { QrCode, Trash2, Edit, Plus, Download, RefreshCw } from 'lucide-react';

interface Table {
  id: string;
  number: string;
  name: string | null;
  seats: number;
  status: string;
  qr_code_url: string | null;
  created_at: string;
  updated_at: string;
}

const formSchema = z.object({
  number: z.string().min(1, "Table number is required"),
  name: z.string().optional(),
  seats: z.number().min(1, "Table must have at least 1 seat"),
});

const TableManager = () => {
  const { toast } = useToast();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  const [generatingQR, setGeneratingQR] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: "",
      name: "",
      seats: 2,
    },
  });
  
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: "",
      name: "",
      seats: 2,
    },
  });
  
  // Fetch tables from Supabase
  const fetchTables = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .order('number');
        
      if (error) {
        toast({
          title: "Error fetching tables",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setTables(data || []);
    } catch (error) {
      toast({
        title: "Error fetching tables",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTables();
  }, []);
  
  // Generate a QR code for a table
  const generateQRCode = async (tableId: string, tableNumber: string) => {
    setGeneratingQR(tableId);
    
    try {
      // Create QR code that points to /menu?table={tableNumber}
      const baseUrl = window.location.origin;
      const tableUrl = `${baseUrl}/menu?table=${tableNumber}`;
      
      // For simplicity, we'll use an external QR code service
      const qrServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tableUrl)}`;
      
      // Update the table with the QR code URL
      const { error } = await supabase
        .from('tables')
        .update({ qr_code_url: qrServiceUrl })
        .eq('id', tableId);
        
      if (error) {
        toast({
          title: "Error generating QR code",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "QR Code Generated",
        description: `QR code for Table ${tableNumber} has been generated.`,
      });
      
      // Refresh tables to show updated QR code
      fetchTables();
    } catch (error) {
      toast({
        title: "Error generating QR code",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setGeneratingQR(null);
    }
  };
  
  // Add a new table
  const onAddTable = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from('tables')
        .insert({
          number: values.number,
          name: values.name || null,
          seats: values.seats,
        });
        
      if (error) {
        toast({
          title: "Error adding table",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Table Added",
        description: `Table ${values.number} has been added.`,
      });
      
      // Reset form and close dialog
      form.reset();
      setIsAddDialogOpen(false);
      fetchTables();
    } catch (error) {
      toast({
        title: "Error adding table",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  
  // Update a table
  const onUpdateTable = async (values: z.infer<typeof formSchema>) => {
    if (!currentTable) return;
    
    try {
      const { error } = await supabase
        .from('tables')
        .update({
          number: values.number,
          name: values.name || null,
          seats: values.seats,
        })
        .eq('id', currentTable.id);
        
      if (error) {
        toast({
          title: "Error updating table",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Table Updated",
        description: `Table ${values.number} has been updated.`,
      });
      
      // Reset form and close dialog
      editForm.reset();
      setIsEditDialogOpen(false);
      setCurrentTable(null);
      fetchTables();
    } catch (error) {
      toast({
        title: "Error updating table",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  
  // Delete a table
  const onDeleteTable = async (tableId: string, tableNumber: string) => {
    try {
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', tableId);
        
      if (error) {
        toast({
          title: "Error deleting table",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Table Deleted",
        description: `Table ${tableNumber} has been deleted.`,
      });
      
      fetchTables();
    } catch (error) {
      toast({
        title: "Error deleting table",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  
  // Open edit dialog and set current table
  const handleEditTable = (table: Table) => {
    setCurrentTable(table);
    editForm.reset({
      number: table.number,
      name: table.name || "",
      seats: table.seats,
    });
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Tables Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage cafe tables and their QR codes
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onAddTable)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Table Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. T1, Table 1, Patio 3" {...field} />
                      </FormControl>
                      <FormDescription>
                        A unique identifier for this table
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Window Seat, Corner Booth" {...field} />
                      </FormControl>
                      <FormDescription>
                        A friendly name to help identify this table
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="seats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seats</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of seats at this table
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-4">
                  <Button type="submit">Create Table</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Separator />
      
      {/* Table listing */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>List of all cafe tables</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Table Number</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>QR Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Loading tables...
                </TableCell>
              </TableRow>
            ) : tables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No tables added yet. Add your first table to get started!
                </TableCell>
              </TableRow>
            ) : (
              tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell className="font-medium">{table.number}</TableCell>
                  <TableCell>{table.name || "-"}</TableCell>
                  <TableCell>{table.seats}</TableCell>
                  <TableCell>
                    {table.qr_code_url ? (
                      <div className="flex items-center gap-2">
                        <a 
                          href={table.qr_code_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center gap-1"
                        >
                          <QrCode size={16} />
                          View
                        </a>
                        <a 
                          href={table.qr_code_url} 
                          download={`table-${table.number}-qr.png`}
                          className="text-green-500 hover:underline flex items-center gap-1"
                        >
                          <Download size={16} />
                          Download
                        </a>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => generateQRCode(table.id, table.number)}
                        disabled={generatingQR === table.id}
                      >
                        {generatingQR === table.id ? (
                          <>
                            <RefreshCw size={16} className="mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <QrCode size={16} className="mr-2" />
                            Generate QR
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditTable(table)}
                      >
                        <Edit size={16} />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Table</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete Table {table.number}?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteTable(table.id, table.number)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Table</DialogTitle>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onUpdateTable)} className="space-y-4 py-2">
              <FormField
                control={editForm.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="seats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seats</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button type="submit">Update Table</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableManager;
