namespace pfa__.net.DTO
{
    public class ConditionDto
    {
        public int Id { get; set; }
        public int IdEquipement { get; set; }
        public string NomEquipement { get; set; } = string.Empty;
        public string TypeEquipement { get; set; } = string.Empty;
        public string Valeur { get; set; } = string.Empty;
        public string DateHeure { get; set; } = string.Empty;
    }
}