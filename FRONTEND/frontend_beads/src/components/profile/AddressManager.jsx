import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

const provinces = [
  "Province 1",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

export const AddressManager = () => {
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      name: "Home",
      phone: "+977-98xxxxxxxx",
      province: "Bagmati Province",
      district: "Kathmandu",
      municipality: "Kathmandu Metropolitan City",
      ward: "10",
      street: "Thamel, Marg",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    municipality: "",
    ward: "",
    street: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingId ? { ...formData, id: editingId } : addr
        )
      );
      toast.success("Address updated successfully!");
    } else {
      setAddresses([...addresses, { ...formData, id: Date.now().toString() }]);
      toast.success("Address added successfully!");
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      province: "",
      district: "",
      municipality: "",
      ward: "",
      street: "",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    toast.info("Address deleted");
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      )}

      {showForm && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Address Label</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Home, Office, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+977-98xxxxxxxx"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="province">Province</Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) =>
                    setFormData({ ...formData, province: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  placeholder="e.g., Kathmandu"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="municipality">Municipality/VDC</Label>
                <Input
                  id="municipality"
                  value={formData.municipality}
                  onChange={(e) =>
                    setFormData({ ...formData, municipality: e.target.value })
                  }
                  placeholder="e.g., Kathmandu Metropolitan City"
                  required
                />
              </div>
              <div>
                <Label htmlFor="ward">Ward Number</Label>
                <Input
                  id="ward"
                  value={formData.ward}
                  onChange={(e) =>
                    setFormData({ ...formData, ward: e.target.value })
                  }
                  placeholder="e.g., 10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="street">Street/Area</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                placeholder="e.g., Thamel, Marg"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit">
                {editingId ? "Update" : "Save"} Address
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <Card key={address.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold">{address.name}</h4>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEdit(address)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => handleDelete(address.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>{address.phone}</p>
              <p>{address.street}</p>
              <p>
                Ward {address.ward}, {address.municipality}
              </p>
              <p>
                {address.district}, {address.province}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
