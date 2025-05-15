export const uploadImageFile = async (file: File, folder: string): Promise<string> => {
    if (!file.type.startsWith("image/")) {
        throw new Error("Solo se permiten archivos de imagen.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("http://localhost:8080/api/upload/file", {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data?.path) {
        throw new Error(data?.error || "Error al subir imagen.");
    }

    return data.path;
};
  

export const uploadDocumentFile = async (file: File, folder: string): Promise<string> => {
    if (file.type !== "application/pdf") {
      throw new Error("Solo se permiten archivos PDF.");
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
  
    const response = await fetch("http://localhost:8080/api/upload/file", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
  
    if (!response.ok || !data?.path) {
      throw new Error(data?.error || "Error al subir el documento.");
    }
  
    return data.path;
};
  