import React from "react";
import "./Pagination.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  const pagesToShow = 2; // Cantidad de páginas visibles antes y después de la actual
  let pages: (number | string)[] = [];

  if (totalPages <= 1) return null;

  // Agregar siempre la primera página
  pages.push(1);

  // Agregar "..." si estamos lejos del inicio
  if (page > pagesToShow + 2) {
    pages.push("...");
  }

  // Agregar páginas contiguas al actual
  for (let i = Math.max(2, page - pagesToShow); i <= Math.min(totalPages - 1, page + pagesToShow); i++) {
    pages.push(i);
  }

  // Agregar "..." si estamos lejos del final
  if (page < totalPages - pagesToShow - 1) {
    pages.push("...");
  }

  // Agregar siempre la última página
  pages.push(totalPages);

  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        ⬅ Anterior
      </button>

      {pages.map((p, index) =>
        typeof p === "number" ? (
          <button
            key={index}
            className={p === page ? "active" : ""}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ) : (
          <span key={index} className="dots">...</span>
        )
      )}

      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Siguiente ➡
      </button>
    </div>
  );
};
