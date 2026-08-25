import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/ui/Icon";
import { useAuth } from "../../../../hooks/useAuth";
import { usersService } from "../../../../services/usersService";
import DeleteAccountModal from "../DeleteAccountModal";

export default function DangerTab() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteAccount = async (password: string) => {
    await usersService.deleteAccount({ password });
    logout();
    navigate("/", { replace: true });
  };

  return (
    <Card title="Zona de risco">
      <p className="text-sm text-ink-soft mb-4">
        Excluir sua conta apaga permanentemente todos os seus dados financeiros, seu progresso na educação
        financeira e sua foto de perfil. Essa ação não pode ser desfeita.
      </p>
      <Button variant="danger" onClick={() => setIsDeleteOpen(true)} className="w-fit">
        <Icon name="trash" size={16} />
        Excluir conta
      </Button>

      {isDeleteOpen && (
        <DeleteAccountModal onConfirm={handleDeleteAccount} onClose={() => setIsDeleteOpen(false)} />
      )}
    </Card>
  );
}
