---
layout: post
title:  "Creating an Item Bank for IRT analysis in R"
date:   2018-03-10 16:45:49 +0100
categories: IRT
---
Item Response Theory (IRT) is a powerful tool that is the workhorse in many psychometric applications. It allows us to estimate the ability of test-takers, while important item parameters such as discrimination<sup>[1](#myfootnote1)</sup> and difficulty remain stable across samples ([Lord 1980](https://books.google.no/books/about/Applications_of_Item_Response_Theory_to.html?id=7YhqAAAAMAAJ&redir_esc=y)). Many R libraries exist today that help researchers simulate the necessary data and to estimate a wide variety of IRT models, including [mirt](https://www.jstatsoft.org/article/view/v048i06/v48i06.pdf), [ltm](https://www.jstatsoft.org/article/view/v017i05), and [catR](https://www.jstatsoft.org/article/view/v048i08) (for an excellent overview of available R packages for IRT modelling, see [this paper](http://epub.wu.ac.at/4010/1/resrepIRThandbook.pdf)).

Yet, to fully understand what is going on "under the hood", it is good practice to try to build some of the components that are needed for simulation of IRT models oneself. In this blog post, I go through the process of writing a simple code to generate an item bank with both dichotomous and polytomous items for 2-parameter logistic (2PL) and 3-parameter logistic (3PL) models.<sup>[2](#myfootnote2)</sup> Here, the item bank is specifically intended for a graded response model ([GRM; Samejima 1997](https://link.springer.com/chapter/10.1007/978-1-4757-2691-6_5)), which is designed for *ordered* categories (e.g. "strongy agree, agree, disagree, strongly disagree"). 

# What is an Item Bank?
An item bank is a (preferably large) set of questions that have been calibrated (i.e. of which item parameters have been estimated). Such item parameters include key information about, for example, how appropriate a question is for an examinee (or learner) with a particular level of ability (difficulty), how much of the probability of success is due to guessing, or how well a question distinguishes between low- and high-ability students ("discrimination"). Subsequently, several different algorithms can be used to define tests on the basis of these item parameters. These algorithms are used to, for example, deliver linear-on-the-fly testing (LOFT), where several different (and comparable) permutations of a test are created prior to a test session, or computerised adaptive testing (CAT), where examinees take a fully adaptive test where the next item is selected on the estimated ability of the candidate at that time. 

# Building an Item Bank with R 
R has powerful in-built functions that allow us to build a new, custom item bank generation function with relative ease. The full code for the the function written for this post can be found [in this repo on my github page](https://github.com/ngoet/IRTSimulationR). Here, I go through the process of writing this code step by step.

#### Step 1: Define the function name and parameters
First, we choose a name for our function, and decide how many parameters it will take. Here, I have chosen the inspired name "```generateItembank```" for my function, which takes three parameters: 
1. ```nItems``` (i.e. the total number of items to be generated for the item bank); 
2. ```maxOptions``` (i.e. an integer value that represents the maximum number of response categories);
3. A ```model``` parameter (string value: "2PL" or "3PL"; default = "2PL") that tells the function what item parameters to generate.

```r
generateItembank <- function(nItems, maxOptions, model){
  
  }
```

#### Step 2: Parameter checks
Naturally, we want to makes sure that users provide the right input for the three parameters that go into the function. So, our next step is to define a couple of "checks". For ```nItems``` and ```maxOptions``` we verify that the user input is an integer, using the ```is.wholenumber()``` function. For the ```model``` variable, we simply check that the input is either "2PL" or "3PL". If any of these conditions is not met, the function will ```stop``` and display an error message.

```r
generateItembank <- function(nItems, maxOptions, model){
  
  is.wholenumber <-
    function(x, tol = .Machine$double.eps^0.5)  abs(x - round(x)) < tol
  
  #check entered parameters
  if(!is.wholenumber(nItems)){
    stop("Error. Please enter an integer value for the nItems variable.")
    
  }
  
  if(!is.wholenumber(maxOptions) | maxOptions < 1){
    stop("Error. Please enter a maxOptions between 1 and infinity.")
    
  }
  
  if(!model %in% c("2PL","3PL")){
    stop("Error. Please enter a valid option for the model parameter (2PL/3PL)")
    
  }
```

#### Step 3: Generate the item parameters
Next up: generating the item parameters for the items that go into our "bank". In case we want to run a "2PL" model at some late stage, we only need discrimination and difficulty parameters (see above); if instead we want a "3PL" model, we should also include a parameter to account for guessing. In the code snippet below, we generate a vector of (normally distributed) discrimination parameters (stored in the object ```a1```), using R's native ```rlnorm()``` function. We generate a difficulty parameter to distinguish between each response level, using ```rnorm()```. 

```r
  #specify discrimination parameter 
  a1 <- rlnorm(nItems, .2,.2)
  
  numBParam <- maxOptions - 1
  
  if(model == "2PL" | is.null(model)){
    
    #initialise item bank
    itemBank <- data.frame(matrix(ncol = numBParam, nrow = nItems))  
    
    for(i in 1:numBParam){
      itemBank[,i] <- rnorm(nItems)
      
    }
    
    #add discrimination parameter
    library(tibble)
    itemBank <- add_column(itemBank, a1, .before = "X1")
    
    #change column names
    colnames(itemBank) <- gsub("X","b",colnames(itemBank))
    
  }
  
  if(model == "3PL"){
    
    #initialise item bank 
    itemBank <- data.frame(matrix(ncol = numBParam, nrow = nItems))
    
    for(i in 1:numBParam){
      itemBank[,i] <- rnorm(nItems)
      
    }
    
    #add guessing
    g <- rbeta(nItems, 20, 80)
    
    #add discrimination parameter
    library(tibble)
    itemBank <- add_column(itemBank, a1, .before = "X1")
    
    #change column names
    colnames(itemBank) <- gsub("X","b",colnames(itemBank))
    
  } 
  
 
```

#### Step 4: Varying the number of responses
To ensure that our item bank contains items with varying numbers of responses, we randomly insert ```NA``` values in each row, starting from the right. That is, provided that the number of response categories exceeds one, we introduce missing values with some probability to each difficulty parameter column (here p = 0.15), excluding the first column (as we naturally always want to have at least one parameter). 

```
 #randomly insert NA as per maxOptions if maxOptions > 1
  if(maxOptions > 1){
    
    #go through each b column (starting with the last) and assign NAs
    #identify b columns
    bColumns <- sort(grep("b",colnames(itemBank)),decreasing=T)
    bColumns <- bColumns[bColumns!=min(bColumns)]
    
    for (column in bColumns){
      
      B <- itemBank[,column]
      newB <- unlist(lapply(B, function(cc) cc[ sample(c(TRUE, NA), 
      prob = c(0.85, 0.15), size = length(cc), replace = TRUE) ]))
      
      #assign appropriate place in item bank
      itemBank[,column] <- newB
      
      #update item bank
      itemBank[is.na(itemBank[,column]), !colnames(itemBank) %in% 
      c(paste("b",as.numeric(gsub("[^\\d]+","", colnames(itemBank)[column], 
      perl=TRUE))-1,sep=""),"b1","g","a1")] <- NA
      
    }
  }
  
```

#### Step 5: Running our custom function
And there you go: a custom function for creating your very own item bank. To use your own function in R, simply save it in a script (```myscript.R```), point your R session to this working directory, run the ```source("myscript.R")``` command, and use the function call with the appropriate input.  

## Notes
<a name="myfootnote1">1</a>. I.e. the ability of a question to distinguish between highly- and poorly-performing learners.

<a name="myfootnote2">2</a>. The 2PL model only includes discrimination and difficulty parameters, whereas the 3PL also includes a parameter to account for guessing.

