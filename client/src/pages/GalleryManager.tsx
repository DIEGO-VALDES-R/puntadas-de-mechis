import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";

export default function GalleryManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    price: "",
  });

  const galleryQuery = trpc.gallery.getAll.useQuery();
  const createMutation = trpc.gallery.create.useMutation();
  const updateMutation = trpc.gallery.update.useMutation();
  const deleteMutation = trpc.gallery.delete.useMutation();
  const uploadImageMutation = trpc.gallery.uploadImage.useMutation();

  const handleImageSelect = async (file: File, preview: string) => {
    setIsUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        try {
          const result = await uploadImageMutation.mutateAsync({
            imageBase64: base64,
            fileName: file.name,
          });
          setFormData({ ...formData, imageUrl: result.imageUrl });
          toast.success("Imagen cargada exitosamente");
        } catch (error) {
          toast.error("Error al cargar la imagen");
          console.error(error);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Error al procesar la imagen");
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.imageUrl) {
      toast.error("Título e imagen son requeridos");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          title: formData.title,
          description: formData.description,
          price: formData.price ? parseInt(formData.price) * 100 : undefined,
        });
        toast.success("Producto actualizado");
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          price: formData.price ? parseInt(formData.price) * 100 : undefined,
        });
        toast.success("Producto creado");
      }

      setFormData({ title: "", description: "", imageUrl: "", price: "" });
      setEditingId(null);
      setIsOpen(false);
      galleryQuery.refetch();
    } catch (error) {
      toast.error("Error al guardar el producto");
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl,
      price: item.price ? (item.price / 100).toString() : "",
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Producto eliminado");
      galleryQuery.refetch();
    } catch (error) {
      toast.error("Error al eliminar el producto");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingId(null);
    setFormData({ title: "", description: "", imageUrl: "", price: "" });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestor de Galería</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={20} />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Producto" : "Nuevo Producto"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Nombre del producto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Descripción
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descripción del producto"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Imagen
                  </label>
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    currentImage={formData.imageUrl}
                    disabled={isUploading}
                  />
                  {formData.imageUrl && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Imagen cargada
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Precio (COP)
                  </label>
                  <Input
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="50000"
                    type="number"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                  >
                    {editingId ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {galleryQuery.isLoading ? (
          <div className="text-center py-12">Cargando...</div>
        ) : galleryQuery.data?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hay productos en la galería
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryQuery.data?.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  {item.description && (
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  {item.price && (
                    <p className="text-lg font-bold">
                      ${(item.price / 100).toLocaleString("es-CO")}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit2 size={16} />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
