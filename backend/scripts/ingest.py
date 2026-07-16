from app.rag import build_or_load_vectorstore
if __name__ == "__main__":
    vs = build_or_load_vectorstore()
    print("Vector store ready.")
