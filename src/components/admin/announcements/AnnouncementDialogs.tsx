
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { AnnouncementForm } from "./AnnouncementForm";
import { Announcement } from "@/types";

interface DialogsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  currentAnnouncement: Announcement | null;
  isSubmitting: boolean;
  onCreateSubmit: (values: any) => Promise<void>;
  onEditSubmit: (values: any) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
}

export const AnnouncementDialogs = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  currentAnnouncement,
  isSubmitting,
  onCreateSubmit,
  onEditSubmit,
  onDeleteConfirm,
}: DialogsProps) => {
  return (
    <>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>
              Create a new announcement to share with all users
            </DialogDescription>
          </DialogHeader>
          <AnnouncementForm
            onSubmit={onCreateSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Announcement"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update the announcement details
            </DialogDescription>
          </DialogHeader>
          {currentAnnouncement && (
            <AnnouncementForm
              defaultValues={{
                title: currentAnnouncement.title,
                content: currentAnnouncement.content,
                isPinned: currentAnnouncement.isPinned
              }}
              onSubmit={onEditSubmit}
              isSubmitting={isSubmitting}
              submitLabel="Update Announcement"
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 pb-6">
            {currentAnnouncement && (
              <p className="font-medium">{currentAnnouncement.title}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
