import {Component, OnInit} from '@angular/core';
import {ProductCredentials} from '../../../../shared/products/ProductCredentials';
import {ProductService} from '../../../services/product.service';
import {ProductUpdate} from '../../../../shared/products/ProductUpdate';
import {Product} from '../../../../shared/products/Product';
import {forkJoin} from 'rxjs';
import {User} from '../../../../shared/users/User';
import {Device} from '../../../../shared/devices/Device';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  client: User;

  addingProduct: boolean;

  products: Product[];

  productSearch = '';

  newProduct = ProductCredentials.empty();
  successfulAdd: boolean;
  showSubmitMsg = false;

  editingProduct: ProductUpdate = ProductUpdate.empty();
  editProductId: string;
  successfulEdit: boolean;
  showEditMsg = false;

  deleteProductId: string;
  successfulDelete: boolean;
  showDeleteMsg = false;

  constructor(private productService: ProductService, private userService: UserService) {
    this.load();
    this.addingProduct = false;
  }

  ngOnInit() {
  }

  load() {
    const futureClient = this.userService.getLoggedUser();

    forkJoin(futureClient)
        .subscribe(([client]) => {
          this.client = client;
          this.productService.fetchClientProducts(client.id).subscribe(products => {
            this.products = products;
          });
        });
  }

  // Add
  toggleAddingProduct() {
    this.addingProduct = !this.addingProduct;
  }

  submitProduct() {
    console.log(this.newProduct);
    this.productService
      .addProduct(this.newProduct)
      .subscribe(submitted => {
        this.successfulAdd = submitted;
        if (this.successfulAdd) {
          this.load();
        }
        this.showSubmitMsg = true;
        setTimeout(() => this.showSubmitMsg = false, 1000);
      });
  }

  // Edit

  startProductEdit(product: Product) {
      this.editingProduct = ProductUpdate.for(product);
      this.editProductId = product.id;
  }

  editProduct() {
      this.productService
          .updateProduct(this.editProductId, this.editingProduct)
          .subscribe(edited => {
              this.successfulEdit = edited;
              if (this.successfulEdit) {
                this.load();
              }
              this.showEditMsg = true;
              setTimeout(() => this.showEditMsg = false, 1000);
          });
  }

  cancelEdit() {
      this.editingProduct = ProductUpdate.empty();
      this.editProductId = undefined;
  }

  // Delete

  startProductDelete(id: string) {
    this.deleteProductId = id;
  }

  deleteProduct() {
      this.productService
          .deleteProduct(this.deleteProductId)
          .subscribe(deleted => {
              this.successfulDelete = deleted;
              if (this.successfulDelete) {
                this.load();
              }
              this.showDeleteMsg = true;
              setTimeout(() => this.showDeleteMsg = false, 1000);
          });
  }

  cancelDelete() {
    this.deleteProductId = undefined;
  }

  // Search

  filteredProducts(): Product[] {
      if (this.productSearch === '') {
          return this.products;
      }
      return this.products.filter(v => this.productSearchFilter(v));
  }

  productSearchFilter(product: Product): boolean {
      return !![product.name]
          .map(e => e.toLowerCase())
          .find(e => e.includes(this.productSearch.toLowerCase()));
  }
}
