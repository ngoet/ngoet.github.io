---
layout: post
title:  "Combining Python and R scripts in R for replication data"
date:   2019-01-21 11:27:49 +0100
categories: programming
---

When submitting replication data for an academic paper, more complex statistical analyses often require the use of scripts in different programming languages. For example, I often run machine learning and data processing applications in Python, while I estimate statistical models in R. To allow other researchers to replicate your analyses quickly and easily, you can excecute all scripts through one wrapper function in R. In this post, I show the steps of writing a simple function that takes the full path to an R or Python script, executes it, and writes information about the script execution to a log file. The full code for this post is [available here](https://gist.github.com/ngoet/c61435adf8997815b60394f637c4e740).

## Setting up a log file
First, with any replication exercise it is good practice to keep a log file to keep track of which scripts have been executed, and what files and/or figures have been generated. A log-file is easily set up in R using the code below.

```r
logfile_name <- gsub('-| |:','_',paste('logfile_',Sys.time(),'.log',sep=''))
log_file <- file(logfile_name)
``` 

I always like to include the start time of the replication in the file name using `Sys.time()` (just in case you want to run multiple iterations to compare). `gsub` can be used to remove any white spaces and other unusual characters, replacing them with underscores. 

New messages are appended to the log file by "opening" it (i.e. establishing a connection) and using the `cat()` command to add a log entry. Use `paste()` to combine information that you have stored in objects with other strings (in this example, I include the name of the script that I am executing, stored in a variable called `script_name`). Finally, make sure to close the log file again as soon as the log message has been registered.
```r
log_file <- file(logfile_name, open = 'a')

cat(
	paste(
		'\n\nExecuting ',
		script_name,
		' script (start time: ',
		Sys.time(),')',
		sep=''
		), 
	file = log_file, 
	append = TRUE
	)

close(log_file)
```

## Executing a Python script through R
To execute an R file that you have stored in your working directory, you can simply call `source(script_name.R)`. For Python scripts, the setup is a bit more complicated. The code to execute a Python script with input parameters is shown below. 

```r
system(paste('python3', script_name, input_params, sep=' '))
```

Let's go through this code step-by-step. First, you need to pass in the Python code as you would use in Terminal (on Mac OS) or Command Prompt (on Windows), e.g. `python3 myscript.py`. However, often you'll want to include some input parameters that are used in your Python code. To do so, you can assign your input parameters to an object in R (in this example, this object is called `input_params`). In a second, step you'll need to make some changes to your Python script to ensure that these parameters can actually be used by your programme: `sys.argv[index]`. This is illustrated in the example below.

```python
import sys
x = float(sys.argv[1])

print(x + 5)
```
In this very simple example, assume that our script is called `add_five.py`. Also assume that, for whatever reason, we'd like to run this Python code from R and apply it to the float value `3.0`. This can be achieved by using the `system()` command in R in combination with your input data and the python script in the following code: `system(paste('python3 add_five.py 3.0')`. `sys.argv` allows you to grab the input from your command. Since Pyton indexes lists by zero-based integers, the script name (which you'll rarely need in your Python code) can be accessed through `sys.argv[0]`, while the float value `3.0` may be included for use in the calculations in Python by adding the argument `sys.argv[1]`. Do note that this argument will read in your command as a string value, so you'll have to cast it to a type that is appropriate for your code (here: a float value).


## Putting it all together
Putting all of the above together, we can define a simple wrapper function that executes files from R, taking the log file, a print message, a script name, some input parameters, and the programming language (R or Python). The full code is shown below. This function allows the user to execute R and Python files, and registers a simple log message upon completion of the script execution. When your replication data includes many different scripts, and combines Python and R, using a wrapper function is a simpler way to create a neat replication workflow. 

```r
# set up log file
logfile_name <- gsub('-| |:','_',paste('logfile_',Sys.time(),'.log',sep=''))
log_file <- file(logfile_name)

#  function
execute_script <- function(print_message,script_name,type="R",input_params=NULL){
  message(print_message)
  log_file <- file(logfile_name, open = 'a')
  cat(paste('\n\nExecuting ',script_name,' script (start time: ',Sys.time(),')',sep=''), file = log_file,append = TRUE)
  close(log_file)
  
  if(type=="R"){
    execution_time <- round(system.time({source(script_name)})[3]/60,digits=2)
  }else{
    execution_time <- round(system.time({system(paste('python3',script_name,input_params,sep=' '))})[3]/60,digits=2)  
  }
  
  log_file <- file(logfile_name, open = 'a')
  cat(paste('\n',script_name, ' script successfully run. Execution time: ',execution_time," minutes",sep=''), file = log_file,append = TRUE)
  close(log_file)
  
  message(paste('\n',script_name, ' script successfully run. Execution time: ',execution_time," minutes",sep=''))
  
}
```

