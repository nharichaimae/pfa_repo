using pfa__.net.Models;
using pfa__.net.DTO;

namespace pfa__.net.Mapper
{
    public static class ConditionMapper
    {
        public static ConditionDto ToDto(ConditionHistorique condition)
        {
            return new ConditionDto
            {
                Id             = condition.Id,
                IdEquipement   = condition.IdEquipement,
                NomEquipement  = condition.Equipement?.Nom ?? string.Empty,
                TypeEquipement = condition.Equipement?.Etat ?? string.Empty,
                Valeur         = condition.Valeur,
                DateHeure      = condition.DateHeure.ToString("yyyy-MM-ddTHH:mm:ss") // ✅ DateTime → string
            };
        }

        public static ConditionHistorique ToModel(ConditionCreateDto dto)
        {
            return new ConditionHistorique
            {
                IdEquipement = dto.IdEquipement,
                Valeur       = dto.Valeur,
                DateHeure    = DateTime.Now
            };
        }

        public static List<ConditionDto> ToDtoList(IEnumerable<ConditionHistorique> conditions)
        {
            return conditions.Select(ToDto).ToList();
        }
    }
}