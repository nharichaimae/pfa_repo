namespace pfa__.net.DTO
{
    public class RegleViewModel
    {
        public int IdRegle { get; set; }
        public DateTime? DateRegle { get; set; } // nullable
        public string HeureDebut { get; set; } = string.Empty;
        public string HeureFin { get; set; } = string.Empty;
        public int IdEquipement { get; set; }
        public string NomEquipement { get; set; } = string.Empty;
        public string TypeEquipement { get; set; } = string.Empty;
        public bool ChaqueJour { get; set; } = false;
    }

    public class RegleCreateViewModel
    {
        public DateTime? DateRegle { get; set; } //  nullable
        public string HeureDebut { get; set; } = string.Empty;
        public string HeureFin { get; set; } = string.Empty;
        public int IdEquipement { get; set; }
        public bool ChaqueJour { get; set; } = false;
    }
}