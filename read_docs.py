import fitz
import sys

def try_read_pdf(path):
    try:
        doc = fitz.open(path)
        with open('pdf_out.txt', 'w', encoding='utf-8') as out:
            for page in doc:
                out.write(page.get_text() + "\n")
        return "fitz success"
    except Exception as e:
        return f"fitz failed: {e}"

print("PDF status:", try_read_pdf(sys.argv[1]))
