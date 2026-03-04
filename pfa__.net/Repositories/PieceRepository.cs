using Microsoft.EntityFrameworkCore;
using pfa__.net.Data;
using pfa__.net.DTO;
using pfa__.net.Models;
using pfa__.net.Repositories;

namespace pfa__.net.Repositories
{
    public class PieceRepository : IPieceRepository
    {
        private readonly AppDbContext _context;

        public PieceRepository(AppDbContext context)
        {
            _context = context;
        }

        // Ajouter une pièce
        public async Task<int> AddPieceAsync(Piece piece)
        {
            _context.Pieces.Add(piece);
            await _context.SaveChangesAsync();
            return piece.Id_Piece;
        }

        public async Task<List<Piece>> ListerPiece(int userId)
        {

            return await _context.Pieces
                     .Where(p => p.Id == userId)
                      .Include(p => p.PieceType)
                     .Include(p => p.Equipements)
                     .ThenInclude(e => e.EquipementType)
                     .ToListAsync();


        }
        public async Task<bool> SupprimerPieceAsync(int pieceId)
        {
            var piece = await _context.Pieces.FindAsync(pieceId);

            if (piece == null)
                return false;

            _context.Pieces.Remove(piece);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<List<PieceType>> GetPieceTypesAsync()
        {
            return await _context.PieceTypes.ToListAsync();
        }

    }
}
