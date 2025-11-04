// Define file item types
type NewFileItem = { existing: false; file: File };
type ExistingFileItem = { existing: true; name: string };
type FileItem = NewFileItem | ExistingFileItem;

// Function definition
export function getFileDiff(
  currentFiles: FileItem[],
  originalFiles: ExistingFileItem[]
) {
  // Extract newly added files
  const newFiles = currentFiles
    .filter((f): f is NewFileItem => !f.existing)
    .map((f) => f.file);

  // Keep track of existing files that remain
  const keptExisting = currentFiles.filter(
    (f): f is ExistingFileItem => f.existing
  );

  // Identify deleted files
  const deletedFiles = originalFiles.filter(
    (orig) => !keptExisting.some((curr) => curr.name === orig.name)
  );

  return { newFiles, deletedFiles, keptExisting };
}
