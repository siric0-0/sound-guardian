from pathlib import Path
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="Sound Guardian", layout="wide")

html_path = Path(__file__).resolve().parent / "dist" / "index.html"
if not html_path.exists():
    html_path = Path("dist/index.html")

components.html(open(html_path, encoding="utf-8").read(), height=900, scrolling=True)
