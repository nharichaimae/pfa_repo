using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pfa__.net.Models
{
    [Table("regle")]
    public class Regle
    {
        [Key]
        [Column("id_regle")]
        public int IdRegle { get; set; }

        [Column("dateRegle")]
        public DateTime? DateRegle { get; set; }

        [Column("heureDebut")]
        public string HeureDebut { get; set; } = string.Empty;

        [Column("heureFin")]
        public string HeureFin { get; set; } = string.Empty;

        [Column("id_equipement")]
        public int IdEquipement { get; set; }

        [Column("chaque_jour")]
        public bool ChaqueJour { get; set; } = false;

        [ForeignKey("IdEquipement")]
        public Equipement Equipement { get; set; }
    }
}