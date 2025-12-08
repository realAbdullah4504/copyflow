import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import type { ILesson } from "@/types/schedule";

interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'ppt' | 'xls' | 'txt';
  size: string;
  uploaded: string;
}

interface LessonDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: ILesson | null;
  files?: FileItem[];
}

const mockFiles: FileItem[] = [
  { id: '1', name: 'Lesson Plan.pdf', type: 'pdf', size: '2.4 MB', uploaded: '2 days ago' },
  { id: '2', name: 'Worksheet.docx', type: 'doc', size: '1.1 MB', uploaded: '1 day ago' },
  { id: '3', name: 'Presentation.pptx', type: 'ppt', size: '5.7 MB', uploaded: '3 days ago' },
  { id: '4', name: 'Homework.pdf', type: 'pdf', size: '1.8 MB', uploaded: '1 day ago' },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return '📄';
    case 'doc':
      return '📝';
    case 'ppt':
      return '📊';
    case 'xls':
      return '📈';
    default:
      return '📁';
  }
};

export const LessonDetailsModal = ({
  isOpen,
  onClose,
  lesson,
  files = mockFiles,
}: LessonDetailsModalProps) => {
  if (!lesson) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">{lesson.subject}</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-slate-500">
            Teacher: {lesson.teacher} • Grade: {lesson.id.split('-')[0]}
          </div>
        </DialogHeader>

        <div className="mt-6">
          <h3 className="font-medium text-slate-900 mb-3">Lesson Materials</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div 
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                  <div>
                    <div className="font-medium text-slate-900">{file.name}</div>
                    <div className="text-xs text-slate-500">
                      {file.size} • {file.uploaded}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
          <h3 className="font-medium text-slate-900 mb-3">Lesson Notes</h3>
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700">
            {lesson.teacher} will be covering {lesson.subject.toLowerCase()} for {lesson.id.split('-')[0]} grade. 
            Please review the materials before the class and complete the assigned worksheet.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
