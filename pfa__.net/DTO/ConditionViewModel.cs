namespace pfa__.net.DTO
{
    public class ConditionViewModel
    {
        public int Id { get; set; }
        public int IdEquipement { get; set; }
        public string NomEquipement { get; set; } = string.Empty;
        public string TypeEquipement { get; set; } = string.Empty;
        public string Valeur { get; set; } = string.Empty;
        public string DateHeure { get; set; } = string.Empty;
    }

    public class ConditionCreateViewModel
    {
        public int IdEquipement { get; set; }
        public string NomEquipement { get; set; } = string.Empty;
        public string Valeur { get; set; } = string.Empty;
        public string DateHeure { get; set; } = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss");
    }
}