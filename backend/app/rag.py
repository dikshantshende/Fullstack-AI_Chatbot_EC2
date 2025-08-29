import os, glob
from typing import Optional, List
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.docstore.document import Document
from .settings import settings

def _embedding_fn():
    if settings.google_api_key:
        return GoogleGenerativeAIEmbeddings(
            model=settings.embeddings_model,
            google_api_key=settings.google_api_key
        )
    else:
        # Fallback to local embeddings if Google API key not set
        return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def build_or_load_vectorstore(vector_path: str = None, kb_path: str = None):
    vector_path = vector_path or settings.vector_path
    kb_path = kb_path or settings.kb_path
    os.makedirs(vector_path, exist_ok=True)
    # If exists, load
    try:
        vs = FAISS.load_local(vector_path, embeddings=_embedding_fn(), allow_dangerous_deserialization=True)
        return vs
    except Exception:
        pass

    # Else ingest
    files = []
    for ext in ("*.md", "*.txt"):
        files.extend(glob.glob(os.path.join(kb_path, ext)))
    docs: List[Document] = []
    for fp in files:
        with open(fp, "r", encoding="utf-8") as f:
            txt = f.read()
        docs.append(Document(page_content=txt, metadata={"source": os.path.basename(fp)}))

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120)
    chunks = splitter.split_documents(docs)

    vs = FAISS.from_documents(chunks, _embedding_fn())
    vs.save_local(vector_path)
    return vs

def retrieve(query: str, k: int = 4) -> str:
    vs = build_or_load_vectorstore()
    docs = vs.similarity_search(query, k=k)
    out = []
    for d in docs:
        out.append(f"[{d.metadata.get('source','kb')}] {d.page_content[:600]}")
    return "\n\n".join(out)
