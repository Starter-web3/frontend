// 'use client';

// import { useState, useRef } from 'react';
// import Link from 'next/link';
// import { Button } from '../../../../../../components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '../../../../../../components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '../../../../../../components/ui/table';
// import { Upload, FileText, Trash2, Plus, Coins } from 'lucide-react';
// import { Badge } from '../../../../../../components/ui/badge';
// import { ScrollArea } from '../../../../../../components/ui/scroll-area';
// import { Alert, AlertDescription } from '../../../../../../components/ui/alert';
// import DashBoardLayout from '../../DashboardLayout';
// import { parseCSV, createMerkleTree, Recipient } from '../../../../../lib/merkle';

// // Background Shapes Component (unchanged)
// const BackgroundShapes = () => (
//   <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
//     <div className="absolute top-20 left-10 w-32 h-32 border-2 border-purple-500/20 rounded-full animate-pulse"></div>
//     <div className="absolute top-40 right-20 w-24 h-24 border-2 border-blue-500/20 rotate-45 animate-pulse delay-200"></div>
//     <div className="absolute bottom-32 left-20 w-40 h-40 border-2 border-purple-400/15 rounded-2xl rotate-12 animate-pulse delay-400"></div>
//     <div className="absolute top-1/3 left-1/4 w-16 h-16 border-2 border-cyan-500/20 rotate-45 animate-pulse delay-600"></div>
//     <div className="absolute bottom-1/4 right-1/3 w-28 h-28 border-2 border-purple-300/15 rounded-full animate-pulse delay-800"></div>
//     <div className="absolute top-10 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-500/15 to-transparent rounded-full blur-xl animate-pulse delay-1000"></div>
//     <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-xl animate-pulse delay-1200"></div>
//     <div className="absolute top-1/2 right-10 w-48 h-48 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-xl animate-pulse delay-1400"></div>
//   </div>
// );

// type RecipientFile = {
//   id: string;
//   name: string;
//   size: string;
//   count: number;
//   date: string;
//   merkleRoot: string;
//   recipients: Recipient[];
//   proofs: { [address: string]: string[] };
//   distributionMethod: 'equal' | 'custom'; // Added to track distribution method
// };

// export default function UploadPage() {
//   const [files, setFiles] = useState<RecipientFile[]>([]);
//   const [dragActive, setDragActive] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true);
//     } else if (e.type === 'dragleave') {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = async (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       await handleFiles(e.dataTransfer.files);
//     }
//   };

//   const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     if (e.target.files && e.target.files[0]) {
//       await handleFiles(e.target.files);
//     }
//   };

//   const handleFiles = async (fileList: FileList) => {
//     const newFiles: RecipientFile[] = [];
//     for (const file of Array.from(fileList)) {
//       if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
//         try {
//           const recipients = await parseCSV(file);
//           if (recipients.length === 0) {
//             alert('No valid addresses found in CSV.');
//             continue;
//           }
//           // Determine distribution method based on whether any recipient has an amount
//           const hasAmounts = recipients.some((recipient) => !!recipient.amount);
//           const distributionMethod = hasAmounts ? 'custom' : 'equal';
//           const { merkleRoot, proofs } = createMerkleTree(recipients, distributionMethod === 'equal', '100'); // Default amount for equal distribution
//           const newFile: RecipientFile = {
//             id: Date.now().toString(),
//             name: file.name,
//             size: `${(file.size / 1024).toFixed(1)} KB`,
//             count: recipients.length,
//             date: new Date().toISOString().split('T')[0],
//             merkleRoot,
//             recipients,
//             proofs,
//             distributionMethod,
//           };
//           newFiles.push(newFile);
//         } catch (error) {
//           console.error('Error processing CSV:', error);
//           alert("Failed to process CSV file. Ensure it has a valid 'address' column and optional 'amount' column for custom distributions.");
//         }
//       }
//     }
//     setFiles((prev) => {
//       const updatedFiles = [...prev, ...newFiles];
//       localStorage.setItem('recipientFiles', JSON.stringify(updatedFiles));
//       return updatedFiles;
//     });
//   };

//   const removeFile = (id: string) => {
//     setFiles((prev) => {
//       const updatedFiles = prev.filter((file) => file.id !== id);
//       localStorage.setItem('recipientFiles', JSON.stringify(updatedFiles));
//       return updatedFiles;
//     });
//   };

//   const onButtonClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <DashBoardLayout>
//       <div className="min-h-screen bg-gradient-to-br from-[#1A0D23] to-[#2A1F36]">
//         <BackgroundShapes />
//         <header className="border-b border-purple-500/20 p-4">
//           <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center gap-2">
//               <Coins className="h-6 w-6 text-purple-400" />
//               <span className="text-xl font-bold text-white">LaunchPad</span>
//             </div>
//             {/* <WalletConnect /> */}
//           </div>
//         </header>

//         <main className="py-12">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center mb-8">
//               <Link href="/dashboard/token-creator/airdrop-listing">
//                 <Button
//                   variant="ghost"
//                   className="text-white hover:bg-purple-500/10 hover:text-purple-200 mr-4"
//                 >
//                   <svg
//                     className="mr-2 h-4 w-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M10 19l-7-7m0 0l7-7m-7 7h18"
//                     />
//                   </svg>
//                   Back to Airdrop Management
//                 </Button>
//               </Link>
//               <h1 className="text-3xl font-bold text-white">Upload Recipients</h1>
//             </div>

//             <div className="grid gap-8 md:grid-cols-3">
//               <div className="md:col-span-2">
//                 <Card className="bg-[#2A1F36]/80 border-purple-500/20 backdrop-blur-sm">
//                   <CardHeader>
//                     <CardTitle className="text-white">Recipient Lists</CardTitle>
//                     <CardDescription className="text-gray-300">
//                       Manage your CSV files containing recipient addresses
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {files.length > 0 ? (
//                       <ScrollArea className="h-[400px]">
//                         <Table>
//                           <TableHeader>
//                             <TableRow className="border-purple-500/20">
//                               <TableHead className="text-gray-300">File Name</TableHead>
//                               <TableHead className="text-gray-300">Recipients</TableHead>
//                               <TableHead className="text-gray-300">Distribution</TableHead>
//                               <TableHead className="text-gray-300">Size</TableHead>
//                               <TableHead className="text-gray-300">Date Added</TableHead>
//                               <TableHead className="text-right text-gray-300">Actions</TableHead>
//                             </TableRow>
//                           </TableHeader>
//                           <TableBody>
//                             {files.map((file) => (
//                               <TableRow key={file.id} className="border-purple-500/20">
//                                 <TableCell className="font-medium text-white">
//                                   <div className="flex items-center">
//                                     <FileText className="mr-2 h-4 w-4 text-purple-400" />
//                                     {file.name}
//                                   </div>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Badge
//                                     variant="outline"
//                                     className="border-purple-500 text-purple-100"
//                                   >
//                                     {file.count} addresses
//                                   </Badge>
//                                 </TableCell>
//                                 <TableCell>
//                                   <Badge
//                                     variant="outline"
//                                     className="border-purple-500 text-purple-100"
//                                   >
//                                     {file.distributionMethod === 'equal' ? 'Equal Split' : 'Custom Amounts'}
//                                   </Badge>
//                                 </TableCell>
//                                 <TableCell className="text-white">{file.size}</TableCell>
//                                 <TableCell className="text-white">{file.date}</TableCell>
//                                 <TableCell className="text-right">
//                                   <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     onClick={() => removeFile(file.id)}
//                                     className="text-purple-100 hover:bg-red-500/10 hover:text-red-400"
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </ScrollArea>
//                     ) : (
//                       <div className="flex h-[400px] flex-col items-center justify-center text-center">
//                         <FileText className="mb-4 h-12 w-12 text-purple-400/50" />
//                         <p className="mb-2 text-lg font-medium text-white">No files uploaded</p>
//                         <p className="text-sm text-gray-300">Upload a CSV file to get started</p>
//                       </div>
//                     )}
//                   </CardContent>
//                   <CardFooter className="flex justify-between">
//                     <Button
//                       variant="outline"
//                       className="border-purple-500 text-purple-100 hover:bg-purple-500/10"
//                       onClick={onButtonClick}
//                     >
//                       <Plus className="mr-2 h-4 w-4" />
//                       Add File
//                     </Button>
//                     <Link href="/dashboard/token-creator/airdrop-listing/distribute">
//                       <Button className="bg-purple-500 hover:bg-purple-600 text-black">
//                         Continue to Distribution
//                       </Button>
//                     </Link>
//                   </CardFooter>
//                 </Card>
//               </div>

//               <div>
//                 <Card className="bg-[#2A1F36]/80 border-purple-500/20 backdrop-blur-sm">
//                   <CardHeader>
//                     <CardTitle className="text-white">Upload New File</CardTitle>
//                     <CardDescription className="text-gray-300">
//                       Upload a CSV file with wallet addresses and optional amounts
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <form onDragEnter={handleDrag} className="flex flex-col items-center">
//                       <input
//                         ref={fileInputRef}
//                         type="file"
//                         accept=".csv"
//                         onChange={handleChange}
//                         className="hidden"
//                       />
//                       <div
//                         className={`flex h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
//                           dragActive
//                             ? 'border-purple-500 bg-purple-500/10'
//                             : 'border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5'
//                         }`}
//                         onClick={onButtonClick}
//                         onDragEnter={handleDrag}
//                         onDragLeave={handleDrag}
//                         onDragOver={handleDrag}
//                         onDrop={handleDrop}
//                       >
//                         <Upload className="mb-4 h-10 w-10 text-purple-400" />
//                         <p className="mb-2 text-center font-medium text-white">
//                           Drag and drop your file here
//                         </p>
//                         <p className="text-center text-sm text-gray-300">or click to browse</p>
//                       </div>
//                     </form>

//                     <Alert className="mt-4 bg-purple-500/10 border-purple-500/20">
//                       <AlertDescription className="text-sm text-gray-300">
//                         Your CSV file must have an <code>address</code> column with valid Ethereum addresses.
//                         <br />
//                         Optional: Include an <code>amount</code> column for custom distribution amounts.
//                         <br />
//                         Example format:
//                         <br />
//                         <code>address,amount</code>
//                         <br />
//                         <code>0x123...,100.5</code>
//                         <br />
//                         <code>0x456...,200.75</code>
//                         <br />
//                         Note: Airdrop creation requires a fee based on the number of recipients.
//                       </AlertDescription>
//                     </Alert>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </DashBoardLayout>
//   );
// }
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../../../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../../../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../../../components/ui/table';
import { Upload, FileText, Trash2, Plus, Coins } from 'lucide-react';
import { Badge } from '../../../../../../components/ui/badge';
import { ScrollArea } from '../../../../../../components/ui/scroll-area';
import { Alert, AlertDescription } from '../../../../../../components/ui/alert';
import DashBoardLayout from '../../DashboardLayout';
import { parseCSV, createMerkleTree, Recipient } from '../../../../../lib/merkle';

// Background Shapes Component (unchanged)
const BackgroundShapes = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-20 left-10 w-32 h-32 border-2 border-purple-500/20 rounded-full animate-pulse"></div>
    <div className="absolute top-40 right-20 w-24 h-24 border-2 border-blue-500/20 rotate-45 animate-pulse delay-200"></div>
    <div className="absolute bottom-32 left-20 w-40 h-40 border-2 border-purple-400/15 rounded-2xl rotate-12 animate-pulse delay-400"></div>
    <div className="absolute top-1/3 left-1/4 w-16 h-16 border-2 border-cyan-500/20 rotate-45 animate-pulse delay-600"></div>
    <div className="absolute bottom-1/4 right-1/3 w-28 h-28 border-2 border-purple-300/15 rounded-full animate-pulse delay-800"></div>
    <div className="absolute top-10 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-500/15 to-transparent rounded-full blur-xl animate-pulse delay-1000"></div>
    <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-xl animate-pulse delay-1200"></div>
    <div className="absolute top-1/2 right-10 w-48 h-48 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-xl animate-pulse delay-1400"></div>
  </div>
);

type RecipientFile = {
  id: string;
  name: string;
  size: string;
  count: number;
  date: string;
  merkleRoot: string;
  recipients: Recipient[];
  proofs: { [address: string]: string[] };
  distributionMethod: 'equal' | 'custom'; // Added to track distribution method
};

export default function UploadPage() {
  const [files, setFiles] = useState<RecipientFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files from sessionStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFiles = sessionStorage.getItem('recipientFiles');
      if (storedFiles) {
        try {
          const parsed = JSON.parse(storedFiles);
          if (Array.isArray(parsed)) {
            setFiles(parsed);
          }
        } catch (error) {
          console.error('Invalid recipientFiles in sessionStorage:', error);
        }
      }
    }
  }, []);

  // Save files to sessionStorage whenever files state changes
  const updateFiles = (newFiles: RecipientFile[]) => {
    setFiles(newFiles);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('recipientFiles', JSON.stringify(newFiles));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    setUploadError('');
    const newFiles: RecipientFile[] = [];
    
    for (const file of Array.from(fileList)) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        try {
          const recipients = await parseCSV(file);
          if (recipients.length === 0) {
            setUploadError('No valid addresses found in CSV file.');
            continue;
          }
          
          // Determine distribution method based on whether any recipient has an amount
          const hasAmounts = recipients.some((recipient) => !!recipient.amount);
          const distributionMethod = hasAmounts ? 'custom' : 'equal';
          
          const { merkleRoot, proofs } = createMerkleTree(
            recipients, 
            distributionMethod === 'custom', 
            '100' // Default amount for equal distribution
          );
          
          const newFile: RecipientFile = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            count: recipients.length,
            date: new Date().toISOString().split('T')[0],
            merkleRoot,
            recipients,
            proofs,
            distributionMethod,
          };
          
          newFiles.push(newFile);
        } catch (error) {
          console.error('Error processing CSV:', error);
          setUploadError(
            `Failed to process CSV file "${file.name}". Ensure it has a valid 'address' column and optional 'amount' column for custom distributions.`
          );
        }
      } else {
        setUploadError('Please upload only CSV files.');
      }
    }
    
    if (newFiles.length > 0) {
      updateFiles([...files, ...newFiles]);
      setUploadError('');
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter((file) => file.id !== id);
    updateFiles(updatedFiles);
  };

  const clearAllFiles = () => {
    updateFiles([]);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getTotalRecipients = () => {
    return files.reduce((total, file) => total + file.count, 0);
  };

  return (
    <DashBoardLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#1A0D23] to-[#2A1F36]">
        <BackgroundShapes />
        <header className="border-b border-purple-500/20 p-4">
          <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">LaunchPad</span>
            </div>
            {/* <WalletConnect /> */}
          </div>
        </header>

        <main className="py-12 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Link href="/dashboard/token-creator/airdrop-listing">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-purple-500/10 hover:text-purple-200 mr-4"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to Airdrop Management
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-white">Upload Recipients</h1>
              </div>
              
              {files.length > 0 && (
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="border-purple-500 text-purple-100">
                    {files.length} file{files.length !== 1 ? 's' : ''} • {getTotalRecipients()} total recipients
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFiles}
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            {uploadError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card className="bg-[#2A1F36]/80 border-purple-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Recipient Lists</CardTitle>
                    <CardDescription className="text-gray-300">
                      Manage your CSV files containing recipient addresses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {files.length > 0 ? (
                      <ScrollArea className="h-[400px]">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-purple-500/20">
                              <TableHead className="text-gray-300">File Name</TableHead>
                              <TableHead className="text-gray-300">Recipients</TableHead>
                              <TableHead className="text-gray-300">Distribution</TableHead>
                              <TableHead className="text-gray-300">Size</TableHead>
                              <TableHead className="text-gray-300">Date Added</TableHead>
                              <TableHead className="text-right text-gray-300">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {files.map((file) => (
                              <TableRow key={file.id} className="border-purple-500/20">
                                <TableCell className="font-medium text-white">
                                  <div className="flex items-center">
                                    <FileText className="mr-2 h-4 w-4 text-purple-400" />
                                    <span className="truncate max-w-[200px]" title={file.name}>
                                      {file.name}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="border-purple-500 text-purple-100"
                                  >
                                    {file.count} addresses
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={`border-purple-500 text-purple-100 ${
                                      file.distributionMethod === 'custom' 
                                        ? 'bg-blue-500/10' 
                                        : 'bg-green-500/10'
                                    }`}
                                  >
                                    {file.distributionMethod === 'equal' ? 'Equal Split' : 'Custom Amounts'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-white">{file.size}</TableCell>
                                <TableCell className="text-white">{file.date}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFile(file.id)}
                                    className="text-purple-100 hover:bg-red-500/10 hover:text-red-400"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    ) : (
                      <div className="flex h-[400px] flex-col items-center justify-center text-center">
                        <FileText className="mb-4 h-12 w-12 text-purple-400/50" />
                        <p className="mb-2 text-lg font-medium text-white">No files uploaded</p>
                        <p className="text-sm text-gray-300">Upload a CSV file to get started</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      className="border-purple-500 text-purple-100 hover:bg-purple-500/10"
                      onClick={onButtonClick}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add File
                    </Button>
                    <Link href="/dashboard/token-creator/airdrop-listing/distribute">
                      <Button 
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                        disabled={files.length === 0}
                      >
                        Continue to Distribution
                        {files.length > 0 && (
                          <Badge className="ml-2 bg-purple-700 text-white">
                            {getTotalRecipients()}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="bg-[#2A1F36]/80 border-purple-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Upload New File</CardTitle>
                    <CardDescription className="text-gray-300">
                      Upload a CSV file with wallet addresses and optional amounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onDragEnter={handleDrag} className="flex flex-col items-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        multiple
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div
                        className={`flex h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                          dragActive
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5'
                        }`}
                        onClick={onButtonClick}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Upload className="mb-4 h-10 w-10 text-purple-400" />
                        <p className="mb-2 text-center font-medium text-white">
                          Drag and drop your file here
                        </p>
                        <p className="text-center text-sm text-gray-300">
                          or click to browse • Multiple files supported
                        </p>
                      </div>
                    </form>

                    <Alert className="mt-4 bg-purple-500/10 border-purple-500/20">
                      <AlertDescription className="text-sm text-gray-300">
                        <strong>CSV Format Requirements:</strong>
                        <br />
                        • Must have an <code className="bg-purple-500/20 px-1 rounded">address</code> column with valid Ethereum addresses
                        <br />
                        • Optional: <code className="bg-purple-500/20 px-1 rounded">amount</code> column for custom distribution
                        <br />
                        <br />
                        <strong>Example:</strong>
                        <br />
                        <code className="bg-purple-500/20 px-1 rounded text-xs">
                          address,amount<br />
                          0x123...,100.5<br />
                          0x456...,200.75
                        </code>
                        <br />
                        <br />
                        <strong>Note:</strong> Airdrop creation requires a fee based on the number of recipients.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashBoardLayout>
  );
}