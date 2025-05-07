import { PRODUCT } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

type OLD = {
  pages: PRODUCT[][];
};

const useAddAndUpdateProduct = (socket: Socket) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleAddProduct = (data: PRODUCT) => {
      const checkStatus = queryClient.getQueryState(["allProducts"]);

      const checkCategoryProductsStatus = queryClient.getQueryState([
        "Category Products",
        data.category?.toString(),
      ]);

      if (checkStatus?.status === "success") {
        queryClient.setQueryData(["allProducts"], (old: OLD) => {
          const modifyPages = old.pages.map((page) => [...page]);

          modifyPages[0] = [data, ...modifyPages[0]];

          return { ...old, pages: modifyPages };
        });
      }

      if (checkCategoryProductsStatus?.status === "success") {
        queryClient.setQueryData(
          ["Category Products", data.category?.toString()],
          (old: OLD) => {
            const modifyPages = old.pages.map((page) => [...page]);

            modifyPages[0] = [data, ...modifyPages[0]];

            return { ...old, pages: modifyPages };
          }
        );
      }
    };

    const handleUpdateProduct = (data: PRODUCT) => {
      const modifyProduct = data;

      const checkStatus = queryClient.getQueryState(["allProducts"]);

      const checkCategoryProductsStatus = queryClient.getQueryState([
        "Category Products",
        data.category?.toString(),
      ]);

      if (checkStatus?.status === "success") {
        queryClient.setQueryData(["allProducts"], (old: OLD) => {
          const modifyPages = old.pages.map((page) =>
            page.map((product) =>
              product._id === modifyProduct._id ? modifyProduct : product
            )
          );

          return { ...old, pages: modifyPages };
        });
      }

      if (checkCategoryProductsStatus?.status === "success") {
        queryClient.setQueryData(
          ["Category Products", data.category?.toString()],
          (old: OLD) => {
            const modifyPages = old.pages.map((page) =>
              page.map((product) =>
                product._id === modifyProduct._id ? modifyProduct : product
              )
            );

            return { ...old, pages: modifyPages };
          }
        );
      }
    };

    socket.on("add-product", handleAddProduct);
    socket.on("update-product", handleUpdateProduct);

    return () => {
      socket.off("add-product", handleAddProduct);
      socket.off("update-product", handleUpdateProduct);
    };
  }, [socket, queryClient]);
};

export default useAddAndUpdateProduct;
